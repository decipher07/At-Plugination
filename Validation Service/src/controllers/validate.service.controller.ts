import { Request, Response } from "express";

function validatePhoneNumber(validationInput: string) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  
    return re.test(validationInput);
}

const validateServiceController = async (req:Request, res: Response) => {
    const { phone } = req.body ;

    if (!validatePhoneNumber(phone))
        return res.status(404).json({ "success": false, "data": null, "message": "Phone number invalid" });

    res.json({ phone: "userId" });
}

export { validateServiceController };