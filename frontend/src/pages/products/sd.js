// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Spinner from 'react-bootstrap/Spinner';

// import { connect } from 'react-redux';
// import { Api } from './../api/Api';

// const ProductDetail = (props) => {
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [cartLoading, setCartLoading] = useState(false);
//     const [selectedSize, setSelectedSize] = useState('');
//     const [selectedColor, setSelectedColor] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [availableQuantity, setAvailableQuantity] = useState(null);

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoading(true);
//                 const pathname = window.location.pathname;
//                 const productId = pathname.substring(pathname.lastIndexOf('/') + 1);
//                 const response = await axios.get(`${Api}/products/${productId}`);
//                 setProduct(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching product:', error);
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, []);

//     const handleClick = async () => {
//         try {
//             setCartLoading(true);

//             // Validate selectedSize, selectedColor, and quantity
//             if (!selectedSize || !selectedColor || quantity < 1) {
//                 console.error('Please select size, color, and quantity.');
//                 setCartLoading(false);
//                 return;
//             }

//             // Find the correct stock item based on selected size and color
//             const stock = product.stocks.find(item => item.size === selectedSize && item.color === selectedColor);

//             if (!stock) {
//                 console.error('Selected combination not found in stocks.');
//                 setCartLoading(false);
//                 return;
//             }

//             const response = await axios.post(`${Api}/product/cart-list`, {
//                 stockId: stock.id,
//                 quantity: quantity
//             }, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//             });

//             // Assuming 'cartCount' is returned from the server
//             const { cartCount } = response.data;

//             // Update cart count in Redux state
//             props.updateCartCount(cartCount);

//             setCartLoading(false);
//         } catch (error) {
//             console.error('Error adding to cart:', error);
//             setCartLoading(false);
//             // Handle error state or display an error message
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'size') {
//             setSelectedSize(value);
//             const stock = product.stocks.find(item => item.size === value);
//             setAvailableQuantity(stock ? stock.quantity : null);
//         } else if (name === 'color') {
//             setSelectedColor(value);
//         } else if (name === 'quantity') {
//             setQuantity(parseInt(value));
//         }
//     };

//     if (loading) {
//         return <Spinner animation="border" />;
//     }

//     if (!product) {
//         return <div>Product not found.</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <div className="row">
//                 <div className="col-md-6">
//                     <div className="product-image">
//                         <img src={product.photo && require(`../../assets/img/${product.photo}`)} alt={product.name} />
//                     </div>
//                 </div>
//                 <div className="col-md-6">
//                     <div className="product-details">
//                         <h1>{product.name}</h1>
//                         <p>{product.description}</p>
//                         <p className="font-weight-bold">Price: ${product.price}</p>
//                         <div className="product-options">
//                             <h3>Available Options:</h3>
//                             <div className="row mb-3">
//                                 <div className="col-md-6">
//                                     <label className="mr-2">Size:</label>
//                                     <select className="form-control" name="size" onChange={handleChange}>
//                                         {product.stocks.map((stock, index) => (
//                                             <option key={index} value={stock.size}>{stock.size}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <label className="mr-2">Color:</label>
//                                     <select className="form-control" name="color" onChange={handleChange}>
//                                         {product.stocks.map((stock, index) => (
//                                             <option key={index} value={stock.color}>{stock.color}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="add-to-cart mt-3">
//                             <div className="qty-label mb-2">
//                                 Qty
//                                 <div className="input-number">
//                                     <input type="number" min="1" name="quantity" disabled={!availableQuantity} value={quantity} onChange={handleChange} className="form-control ml-2" />
//                                 </div>
//                             </div>
//                             <button className="btn btn-primary add-to-cart-btn" onClick={handleClick} disabled={cartLoading}>
//                                 {cartLoading ? (
//                                     <>
//                                         <Spinner animation="border" size="sm" />
//                                         <span className="ml-2">Adding...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <i className="fa fa-shopping-cart"></i>
//                                         <span className="ml-2">Add to Cart</span>
//                                     </>
//                                 )}
//                             </button>
//                             <br />
//                             <sub className="mt-2">{availableQuantity ? `Only ${availableQuantity} item(s) available!` : 'Out of Stock'}</sub>
//                         </div>

//                         <ul className="product-btns mt-3">
//                             <li><a href="#"><i className="fa fa-heart-o"></i> Add to Wishlist</a></li>
//                             <li><a href="#"><i className="fa fa-exchange"></i> Add to Compare</a></li>
//                         </ul>

//                         <ul className="product-links">
//                             <li>Category:</li>
//                             <li><a href="#">{product.category.name}</a></li>
//                         </ul>

//                         <ul className="product-links">
//                             <li>Share:</li>
//                             <li>
//                                 <a href="#"><i className="fa fa-facebook"></i></a>
//                                 <a href="#"><i className="fa fa-twitter"></i></a>
//                                 <a href="#"><i className="fa fa-google-plus"></i></a>
//                                 <a href="#"><i className="fa fa-envelope"></i></a>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

// };

// const mapStateToProps = state => {
//     return {
//         // Add mapStateToProps if needed
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         updateCartCount: (count) => dispatch({ type: 'UPDATE_CART_COUNT', value: count }),
//         // Add other dispatch actions as needed
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);