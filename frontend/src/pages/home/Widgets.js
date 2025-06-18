import React, { Component } from 'react'
import axios from 'axios'
import Slider from 'react-slick'
import { Api } from './../api/Api';
import { Link } from 'react-router-dom';
class WidgetColumn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            products: []
        }
    }

    componentDidMount() {
        this.getProducts()
    }

    getProducts() {
        axios.get(`${Api}/products/discount?limit=6`)
            .then((response) => {
                  console.log("Dữ liệu nhận được từ API:", response.data);
                const products = response.data.data.map(item => {
                    return {
                        id: item.id,
                        name: item.attributes.product_name,
                        category: item.attributes.product_category,
                        description: item.attributes.description,
                        price: item.attributes.price,
                        image: item.attributes.image,
                        sale: item.attributes.sale,
                        sale_price: item.attributes.sale_price,
                        slug: item.attributes.slug,
                        created_at: item.attributes.created_at
                    }
                });

                this.setState({ products });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const settings = {
            infinite: true,
            autoplay: true,
            speed: 300,
            dots: true,
            arrows: false,
        }

        const productChunks = [this.state.products.slice(0, 3), this.state.products.slice(3, 6)];

        return (
            <div>
                <div className="section-title">
                    <h4 className="title">{this.props.title}</h4>
                    <div className="section-nav">
                        <div id="slick-nav-1" className="products-slick-nav"></div>
                    </div>
                </div>

                <div className="products-widget-slick" data-nav="#slick-nav-1">
                    <Slider {...settings}>
                        {productChunks.map((chunk, idx) => (
                            <div key={idx}>
                                {chunk.map(product => (
                                    <div className="product-widget" key={product.id}>
                                        <div className="product-img">
                                            <img
                                                src={`http://localhost:3000/public/${product.image}`}       
                                                  alt={product.name}
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div className="product-body">
                                            <p className="product-category">{product.category}</p>
                                            <h3 className="product-name">
                                                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'red' }}>
        {product.name}
      </Link>
                                            </h3>
                                            {product.sale ? (
                                                <h4 className="product-price">
                                                    {product.sale_price}VND{' '}
                                                    <del className="product-old-price">{product.price}VND</del>
                                                </h4>
                                            ) : (
                                                <h4 className="product-price">{product.price}VND</h4>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        )
    }
}


class Widgets extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="section">
                {/* <!-- container --> */}
                <div className="container">
                    {/* <!-- row --> */}
                    <div className="row">

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Khuyến mãi" />
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Khuyến mãi" />
                        </div>

                        <div className="col-md-4 col-xs-6">
                            <WidgetColumn title="Khuyến mãi" />
                        </div>

                    </div>
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container --> */}
            </div>
        )
    }
}

export default Widgets