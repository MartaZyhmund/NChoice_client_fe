import axios from 'axios';

import { SERVER_URL } from '../config';

export default class AdminService {
    getResource = async url => {
        try {
            const catalogs = await axios.get(`${SERVER_URL}${url}`);
            return catalogs.data;
        } catch (error) {
            console.error(error);
        }
    };

    getAllProducts = async () => {
        const catalogs = await this.getResource('products');
        return catalogs;
    };

    getProductById = async id => {
        const catalogs = await this.getResource(`products/${id}`);
        return catalogs;
    };

    getProductsByFilter = async filter => {
        let queryString = 'products/?';
        const { brand, color, category, catalog } = filter;
        if (brand) {
            queryString = `${queryString}&brand=${brand}`;
        }
        if (color) {
            queryString = `${queryString}&color=${color}`;
        }
        if (category) {
            queryString = `${queryString}&category=${category}`;
        }
        if (catalog) {
            queryString = `${queryString}&catalog=${catalog}`;
        }
        const catalogs = await this.getResource(queryString);
        return catalogs;
    };

    getAllCatalogs = async () => {
        const catalogs = await this.getResource('catalogs');
        return catalogs;
    };

    getCatalogById = async id => {
        const catalogs = await this.getResource(`catalogs/${id}`);
        return catalogs;
    };

    getCatalogByName = async catalogName => {
        const catalogs = await this.getResource(`catalogs/?catalog=${catalogName}`);
        return catalogs;
    };

    getCatalogCategories = async catalogName => {
        const catalogs = await this.getResource(`catalogs/?catalog=${catalogName}`);
        const { categories } = catalogs[0];
        return categories;
    };

    getAllBrands = async () => {
        const brands = await this.getResource('brands');
        return brands;
    };

    getAllCategories = async () => {
        const categories = await this.getResource('categories');
        return categories;
    };

    getAllColors = async () => {
        const colors = await this.getResource('colors');
        return colors;
    };

    getAllUsers = async () => {
        const colors = await this.getResource('users');
        return colors;
    };

    getUserById = async id => {
        const colors = await this.getResource(`users/${id}`);
        return colors;
    };
}