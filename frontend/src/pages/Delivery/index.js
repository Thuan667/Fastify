import OrderSection from "./OrderSection "
import Sidebar from "./Sidebar"


const Delivery = () => {
    return (
        <>
            <div className="d-flex container mt-5 border">
                <Sidebar />
                <OrderSection />
            </div>
        </>
    )

}
export default Delivery;