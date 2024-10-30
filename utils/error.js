export const getError = (res, error) => {
    return res.status(400).json({
      success: false,
      error,
    });
};