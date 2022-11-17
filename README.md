# Atlan - Backend Task

Deepankar Arun Jain

## Problem statement

Design a sample schematic for how you would store forms (with questions) and responses (with answers) in the Collect data store. Forms, Questions, Responses and Answers each will have relevant metadata. Design and implement a solution for the Google Sheets use case and choose any one of the others to keep in mind how we want to solve this problem in a plug-n-play fashion. Make fair assumptions wherever necessary.  Solve this problem in such a way that **each new use case can just be “plugged in”** and does not need an overhaul on the backend. Imagine this as a whole ecosystem for integrations. We want to optimize for **latency and having a unified interface** acting as a middleman**.**

Eventual consistency is what the clients expect as an outcome of this feature, making sure no responses get missed in the journey. Do keep in mind that this solution **must be failsafe**, should eventually recover from circumstances like power/internet/service outages, and should **scale to cases like millions of responses** across hundreds of forms for an organization.

There are points for details on how would you benchmark, set up logs, monitor for system health, and alerts for when the system health is affected for both the cloud as well as bare-metal. **Read up on if there are limitations on the third party** ( Google sheets in this case ) too, a good solution keeps in mind that too.

## Initial Architectures

The problem statement, involved emphasizing the fact of using a “pluggin in” or plug and play architecture for the services. Considering the need to make it plug and play, The first ideology towards the problem statement was considering an open ended solution for maintaining plugins, for instance, validation of savings and monthly income, appending data to google sheet before hiting the main backend service. The architecture like the below: 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled.png)

With respect to the benefits of the architecture, Considering the need for scalability and consistency, this architecture helps to follow up and operate on both the factors. The different plugins can be horizontally or vertically scaled, working towards a consistent solution can be achieved by proper routing and keeping interfaces with proper designs and test cases.

The shortcomings of the architecture exist by actually being implemented in a plug and play architecture asked in problem statement. Considering a happy case, where the client wishes to have a single plugin, then the plugin works well, with a single API call works towards the collect service writing to the database ( if any ). But, Imagine the case, where the client wishes to have two plugins, Now, According to the above architecture, It needs to make two API Calls to the collect service, proning to duplicate entries and more number of API Calls for the architecture. This is where we fail in first place. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%201.png)

The System also fails in the situation to reach out a proper response in place the collect service responds properly, but the internal error in plugin is developed. Imagine the service to append to the spreadsheet once the data is inserted, Running the same as plugin, A structured approach is to wait for the collect api and upon successful completion, append the data to the spreadsheet, But the happy case misses when we appending the data service fails, and henceforth It’ll be difficult extracting the session for which we missed the data insertions. With the emphasis on plug and play architecture. It needs utilising an event-driven approach. The current approach will want us to configure the api gateway by creating a shared layer of middleware plugins. Eventually, the plug and play will involve a comprehensive structure to optimise the operations of adding and removing services.

Considering the same, I modified the approach to make it event driven completely following a plug and play featured.

## Modifying Initial Architectures to an Event Driven Architecture

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%202.png)

The above architecture is an event driven architecture where each service can be added (plugged in) or removed (plugged out) from the system upon the introduction of any event. Considering an example for the same, An event can be recognised as inserting a data in the database, which is created from the collect service. Upon insertion of the data, the event is passed on the subsequent services as a publisher-subscriber model and the services can avail their task such as sending an sms or adding the data to a spreadsheet. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%203.png)

With the advantages of the architecture involve adding any number of services to the system without any external configuration. This helps us in also providing a more scalable and a consistent network of working for our system. 

The above architecture is fully event driven and now becomes the source of its own problem. Noticing properly that, every service is working independently and hence making it difficult to respond. Considering the plugins to search for a slang in data. This service needs to respond to the client for the result. Imagining the request creating an event and the queue has a lot of events inside it, then subscribing to the events will take some ‘x’ amount of time. After this ‘x’ amount of time when the service would’ve responded to the request, It needs to show back the result to the client. Eventually, We can’t block the client until the process is completed ( ie been fetched and computed ) and hence we need sockets to come into play to respond to the client. So the end problem becomes more tedious with working with sockets and ensuring that client receives the response very soon with any delay. Eventually the need to notice is that, searching for a slang in data creates a dependent event for which the response is dependent on the service unlike sending sms which is independent for the client to know about. 

Another case of failure is noticing the validation service. The system flow is communicated by the collect service inserting the data first and then pushing to the message queue. If the validation service is put to action, and it does flag off a data entry, this means that the same entry needs to be deleted from the database making the transactions and database call heavy. This is also followed by a delay in the response to the client about a flagged off entry. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%204.png)

By two failed architectures, We realised that some requests/events require to communicate to the client and hence are cilent dependent and others such as SMS/Spreadsheet can be client independent and can be achieved from event-driven nature.

## Modifying the Event Driven Architecture

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%205.png)

The above modified architecture works by segregating the services based on being dependent of the client and independent of the client. The ones which are client dependent are termed as Pre-Collect Plugin and the independent ones are termed as After Collect Plugins. As discussed above, validation service and slang service can be served as Pre-Collect Plugin and SMS Service and Google Sheets insertion are After-Collect Plugin. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%206.png)

The client makes request to the API Gateway, which depending on the identification as Pre-Collect Service or Post-Collect Service routes to the service. The Pre-Collect Service responds to the client on serving the request, while Post-Collect Service only issues a message to the client if the service has acknowledged the request. 

Extending the advantages of the event driven architecture, We’ve managed to successfully make a scalable and a consistent system, with segregation and decision to make a plugin be added before the collect service or after the collect service. Eventually, the thing to realise is we’ve made a lot decoupling. The Pre-Collect Service plugins can be further integrated to api gateway to directly route the request, thus ending the extended route mechanism which the system is working at currently.

## Final Architecture Proposed

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%207.png)

The final architecture incorporated the benefits of event-driven design as well as the need to create segregated microservice for client dependent services. Henceforth, Our system can be scaled for individual services and corporate more consistent behaviour in terms of solution to add numerous service to the system. Though configuration have to be made in API Gateway for pre-collect service( example: Validate Service and Slangs Service). Since Message Queue stores the event till they’re processed, any failure in Post-Collect Service can be maintained refreshed and the events become consistent at front. The API Gateway can be monitored with Application Monitoring Tools such as New-Relic and Grafana and logs to keep updated about the status of the request and error rate. 

## Understanding the Tech Stack

- Postgresql for Database
    - SQL databases are efficient at processing queries and joining data across tables, making it easier to perform complex queries against structured data, including ad hoc requests. NoSQL databases lack consistency across products and typically require more work to query data, particular as query complexity increases.
- Kong for API Gateway
    - Recognised as the most popular open source API Gateway with necessary tech support. I also tried using Apisix by Apache, but couldn’t configure it and thus didn’t worked
- RabbitMQ for Message Queue
    - Popular open source message queue. This was my first time working with message queues in general, so I took RabbitMQ.
- NodeJS along with Typescript: All the microservices are developed on NodeJS with Typescript
    - I had previous experience developing with NodeJS and Typescript for a clean architecture
- Docker
    - To containerise the application and using Kong service

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%208.png)

## Understanding Google Sheets Service and Validation Service

The two service that I chose to develop was Google Sheet Service and Validation Service. While Google Sheet Service is independent of the client, Validation Service is dependent on the client and hence has been routed via API Gateway ie Kong.

## Google Sheets Service Architecture

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%209.png)

With respect to the external Google Sheets API,  The limitation exists as follows :

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2010.png)

Therefore, If we would’ve connected the Sheets API directly to Sheet Service, then a case would’ve been made where more than 300 read/write request could’ve been made since Sheet Service looks up for the events from Collect Queue. 

Eventually, To solve the issue, the solution was to use a delay queue which delays the messages to be consumed by subscriber by a certain milliseconds. For instance, A delay of 500 milliseconds will delay the message to be consumed by a certain service by 500 milliseconds. Hence, We can avoid a lot of request being embedded to Sheets API. For this, I used delayed queue plugin in RabbitMQ. 

Summarising the above architecture, The Sheet Service has subscribed from Collect Service for insert events in the database. As soon as the event is published, Sheet Service then pass it to another delayed queue, which is further subscribed by add to sheet service which appends the data from Sheets API. 

## Monitoring and Logging

For the purpose of monitoring,, I’ve integrated New Relic Application Monitoring Manager and for the purpose of logging, I’ve used local logging of the messages using chalk and console.logs in Node. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2011.png)

The above log is using the chalk package and console.log. This log can be outputted to a file to perform analysis. 

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2012.png)

The above dashboard is of new-relic application monitoring tool. It provides a comprehensive view for different route request and error rate, with plugins to monitor and generate alerts based on failure.

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2013.png)

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2014.png)

These are some of the features of the application monitoring system, and can be configured for each service as follows:

![Untitled](Atlan%20-%20Backend%20Task%20911017a3e6694e57b6ec03771515f560/Untitled%2015.png)

# Success criteria

The criteria that must be met in order to consider this project a success. 

- ...
- ...

# User stories

How the product should work for various user types.

## **User type 1**

- ...
- ...

## **User type 2**

- ...
- ...

# Scope

## Requirements

Current project requirements.

- ...
- ...

## Future work

Future requirements.

- ...
- ...

## Non-requirements

List anything that is out of scope.

- ...
- ...

# Designs

Include designs here or add directly to the Requirements or User Stories sections. 

# Alternatives considered

List any alternatives you considered to this approach. Explain why they weren't used.

# Related documents

Include links to other pages as necessary (e.g. technical design doc, project proposal, etc.)
