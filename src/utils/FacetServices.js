export default function findCategoryByID(id ,data) {
    const category = data.find(element => element._id === id);
    const name = category?.name;

    return name;
}