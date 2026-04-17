export const create = async ({ model, data }) => {
    await model.create(data);
};
