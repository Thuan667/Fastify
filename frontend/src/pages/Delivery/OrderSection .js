import { Link } from "react-router-dom";
import "../../Layouts/css/Delivery.css"
import { useEffect, useState } from "react";
import TabAllDelivery from "./TabAllDelivery";
import TabCancel from "./TabCancel";

import TabFinish from "./tabFinish";
import TabWait from "./TabWait";
import TabRefund from "./TabRefund";
import TabTrans from "./TabTrans";

const OrderSection = () => {

    //state lưu thông tin sản phẩm
    const [products, setProducts] = useState([]);

    //state lưu điều kiện show
    const [show, setShow] = useState(false);

    //nút mở modal đánh giá
    const handleShow = () => {
        setShow(!show);
    }
    //nút đóng modal đánh giá
    const handleClose = () => {
        setShow(!show);
    }

    //CALL API  
    const getAllOrder = async () => {
        let res = await fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
        // .then(json => console.log(json))
        if (res && res.length > 0) {
            setProducts(res);
        }
        //console.log('check ress:', products)

    }


    useEffect(() => {
        getAllOrder();

    }, [])

    //const [showAll, setShowAll] = useState(true)
    const [showpay, setShowpay] = useState(true)
    const [showTrans, setShowTrans] = useState(false)
    const [showWait, setShowWait] = useState(false)
    const [showFinish, setShowFinish] = useState(false)
    const [showCancel, setShowCancel] = useState(false)
    const [showRefund, setShowRefund] = useState(false)

    // // NÚT TAB HIỆN TẤT CẢ
    // const handleShowAll = () => {
    //     setShowAll(true);
    //     setShowCancel(false);
    //     setShowFinish(false);
    //     setShowRefund(false);
    //     setShowTrans(false);
    //     setShowpay(false);
    //     setShowWait(false);
    // }

    // NÚT CHUYỂN TAB THANH TOÁN
    const handleShowPay = () => {
        //setShowAll(false);
        setShowCancel(false);
        setShowFinish(false);
        setShowRefund(false);
        setShowTrans(false);
        setShowpay(true);
        setShowWait(false);
    }

    //NÚT CHUYỂN TAB ĐANG VẬN CHUYỂN
    const handleShowTrans = () => {
        //setShowAll(false);
        setShowCancel(false);
        setShowFinish(false);
        setShowRefund(false);
        setShowTrans(true);
        setShowpay(false);
        setShowWait(false);
    }

    //NÚT CHUYỂN TAB CHỜ GIAO HÀNG
    const handleShowWait = () => {
       // setShowAll(false);
        setShowCancel(false);
        setShowFinish(false);
        setShowRefund(false);
        setShowTrans(false);
        setShowpay(false);
        setShowWait(true);
    }

    //NÚT CHUYỂN TAB GIAO HÀNG THÀNH CÔNG
    const handleShowFinish = () => {
        //setShowAll(false);
        setShowCancel(false);
        setShowFinish(true);
        setShowRefund(false);
        setShowTrans(false);
        setShowpay(false);
        setShowWait(false);
    }

    //NÚT CHUYỂN TAB ĐƠN HÀNG ĐÃ HỦY
    const handleShowCancel = () => {
        //setShowAll(false);
        setShowCancel(true);
        setShowFinish(false);
        setShowRefund(false);
        setShowTrans(false);
        setShowpay(false);
        setShowWait(false);
    }

    //NÚT CHUYỂN TABB HOÀN HÀNG, TRẢ TIỀN
    const handleShowRefund = () => {
        //setShowAll(false);
        setShowCancel(false);
        setShowFinish(false);
        setShowRefund(true);
        setShowTrans(false);
        setShowpay(false);
        setShowWait(false);
    }
    return (
        <div className="order-section">
            <div className="tabs">
                {/* <Link className={showAll === true ? "tab active" : "tab"} onClick={() => handleShowAll()}>Tất cả</Link> */}
                <Link className={showpay === true ? "tab active" : "tab"} onClick={() => handleShowPay()}>Đang xác nhận</Link>
                <Link className={showTrans === true ? "tab active" : "tab"} onClick={() => handleShowTrans()}>Vận chuyển</Link>
                <Link className={showWait === true ? "tab active" : "tab"} onClick={() => handleShowWait()}>Chờ giao hàng</Link>
                <Link className={showFinish === true ? "tab active" : "tab"} onClick={() => handleShowFinish()}>Hoàn thành</Link>
                <Link className={showCancel === true ? "tab active" : "tab"} onClick={() => handleShowCancel()}>Đã hủy</Link>
                {/* <Link className={showRefund === true ? "tab active" : "tab"} onClick={() => handleShowRefund()}>Trả hàng/Hoàn tiền</Link> */}
            </div>
            <div className="order_section p-2">


                {showCancel === true &&
                    (
                        <TabCancel />
                    )
                }

                {showFinish === true &&
                    (
                        <TabFinish
                            products={products}
                            show={show}
                            handleClose={handleClose}
                            handleShow={handleShow}
                        />
                    )
                }

                {showTrans === true &&
                    (
                        <TabTrans />
                    )
                }

                {showWait === true &&
                    (
                        <TabWait />
                    )
                }

                {showpay === true &&
                    (
                        // <TabPay />
                        <TabAllDelivery
                            products={products}
                            show={show}
                            handleClose={handleClose}
                            handleShow={handleShow}
                        />
                    )
                }

                {showRefund === true &&
                    (
                        <TabRefund />
                    )
                }



            </div>
        </div>
    );
}

export default OrderSection;