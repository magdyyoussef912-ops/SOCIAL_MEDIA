export const successResponse = ({ res, status, message, data }) => {
    return res.status(status || 201).json({ message: message || "done", data });
};
