import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from './ProductItem';
import { Api } from './../api/Api';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            const defaultCategory = categories[0].id;
            setCurrentCategory(defaultCategory);
            setCurrentPage(1);
        }
    }, [categories]);

    useEffect(() => {
        if (currentCategory !== null) {
            fetchProducts(currentPage, currentCategory);
        }
    }, [currentPage, currentCategory]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${Api}/categories`);
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories', error);
            setCategories([]);
        }
    };

    const fetchProducts = async (page, categoryId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${Api}/products`, {
                params: {
                    product_category: categoryId,
                    page: page,
                    limit: 8,
                },
            });

            const rawData = response.data.data || [];

            const mappedProducts = rawData.map(product => {
                const attr = product.attributes || product;
                const cat = categories.find(c => c.id === attr.product_category);
                return {
                    id: product.id,
                    ...attr,
                    category_name: cat ? cat.category_name : 'Uncategorized',
                };
            });

            setProducts(mappedProducts);
            setLastPage(response.data.meta?.pagination?.pageCount || 1);
        } catch (error) {
            console.error('Error fetching products', error);
            setProducts([]);
            setLastPage(1);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (categoryId) => {
        setCurrentCategory(categoryId);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const chunkArray = (array, size) => {
        if (!array) return [];
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const productRows = chunkArray(products, 4);

    return (
        <div>
            <div id="breadcrumb" className="section">
                <div className="container">
                    <div className="col-md-12">
                        <div className="section-title">
                            <h3 className="title">Danh mục sản phẩm</h3>
                            <div className="section-nav">
                                <ul className="section-tab-nav tab-nav">
                                    {categories.map(category => (
  <li key={category.id} className={category.id === currentCategory ? "active" : ""}>
   <button
  onClick={() => handleClick(category.id)}
  onMouseEnter={(e) => {
    e.target.style.color = 'red';
    e.target.style.textDecoration = 'underline';
  }}
  onMouseLeave={(e) => {
    e.target.style.color = category.id === currentCategory ? 'red' : 'black';
    e.target.style.textDecoration = 'none';
  }}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    color: category.id === currentCategory ? 'red' : 'black',
    textDecoration: category.id === currentCategory ? 'underline' : 'none'
  }}
>
  {category.category_name}
</button>

  </li>
))}

                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section">
                <div className="container">
                    {loading ? (
                        <div>Loading...</div>
                    ) : products.length > 0 ? (
                        productRows.map((row, rowIndex) => (
                            <div className="row" key={rowIndex}>
                                {row.map((product) => (
                                    <div className="col-md-3 col-xs-3" key={product.id}>
                                        <ProductItem product={product} />
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div>Không có sản phẩm.</div>
                    )}
                    <div className="pagination">
                        {Array.from({ length: lastPage }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
