const updateSearchFilter = (searchTerm, filter) => {
    delete filter["$text"];
    const regexp = new RegExp("\.*" + searchTerm.trim() + ".*\i");
    filter.$or = [
        { title: regexp },
        { description: regexp }
    ];
};

const getFilters = async query => {
    const { catalog, category, color, brand, searchTerm } = query;
    const filter = {};

    try {
        if (catalog) {
            const catalogItems = await Catalogs.find({ catalog: { $in: catalog.split(',') } });
            catalogItems.forEach((value, i, array) => (array[i] = value.id));
            filter.catalog = { $in: catalogItems };
        }
        if (category) {
            const categoryItems = await Categories.find({ category: { $in: category.split(',') } });
            categoryItems.forEach((value, i, array) => (array[i] = value.id));
            filter.category = { $in: categoryItems };
        }
        if (brand) {
            const brandItems = await Brands.find({ brand: { $in: brand.split(',') } });
            brandItems.forEach((value, i, array) => (array[i] = value.id));
            filter.brand = { $in: brandItems };
        }
        if (color) {
            const colorFilter = await Colors.find({ color: { $in: color.split(',') } });
            colorFilter.forEach((value, i, array) => (array[i] = value.id));
            filter.color = { $in: colorFilter };
        }
        if (isNotBlank(searchTerm)) {
            filter.$text = { $search: searchTerm.trim() };
        }
    } catch (err) {
        throw { message: err.message };
    }

    return filter;
};

const getProjection = async query => {
    const { searchTerm } = query;
    const projection = {};

    if (isNotBlank(searchTerm)) {
        // how much each product is relevant to searchTerm
        projection.score = { $meta: 'textScore' };
    }
    return projection;
};

const getSort = async query => {
    const { searchTerm, sortbyprice, sortbyrate } = query;
    const sort = {};

    if (isNotBlank(sortbyrate)) {
        sort.rate = sortbyrate;
    }
    if (isNotBlank(sortbyprice)) {
        sort.price = sortbyprice;
    }
    else if (isNotBlank(searchTerm)) {
        // sort by relevance
        sort.score = { $meta: "textScore" };
    }
    return sort;
};

const prepareProductsToSend = products => {
    const productsToSend = products.map(product => {
        const newProduct = {
            id: product.id,
            title: product.title,
            images: product.images,
            description: product.description,
            propetries: product.propetries,
            price: product.price,
            mrsp: product.mrsp,
            rate: product.rate
        };

        if (product.brand) newProduct.brand = product.brand.brand;
        if (product.catalog) newProduct.catalog = product.catalog.catalog;
        if (product.category) newProduct.category = product.category.category;
        if (product.color) newProduct.color = product.color.color;
        return newProduct;
    });
    return productsToSend;
};

const prepareProductsToUpdate = async product => {
    const { brand, color, category, catalog } = product;

    if (product.price) product.price = parseFloat(product.price);
    if (product.mrsp) product.mrsp = parseFloat(product.mrsp);
    if (product.rate) product.rate = parseFloat(product.rate);

    if (product.brand) {
        const brandToSave = await Brands.findOne({ brand });
        product.brand = brandToSave._id;
    }

    if (product.catalog) {
        const catalogToSave = await Catalogs.findOne({ catalog });
        product.catalog = catalogToSave._id;
    }

    if (product.category) {
        const categoryToSave = await Categories.findOne({ category });
        product.category = categoryToSave._id;
    }

    if (product.color) {
        const colorToSave = await Colors.findOne({ color });
        product.color = colorToSave._id;
    }
    return product;
};

const isNotBlank = str => !(!str || str.trim().length === 0);

module.exports = {
    prepareProductsToUpdate,
    prepareProductsToSend,
    getSort,
    getProjection,
    getFilters,
    updateSearchFilter,
}