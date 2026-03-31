import React from 'react'
import baseUrl from '../../utils/baseurl';
import toast, { Toaster } from 'react-hot-toast';
import {
    buildAuthHeaders,
    clearStoredToken,
    getStoredToken,
    isUnauthorizedStatus,
} from '../../utils/auth';
// import { setProducts } from '../../Redux/products/productSlice';

const Modal = (props) => {
    // const dispatch = useDispatch();

    const handleDelete = async () => {
        const token = getStoredToken();
        if (!token) {
            clearStoredToken();
            window.location.assign("/login");
            return;
        }

        let requestOptions = {
            method: 'POST',
            headers: buildAuthHeaders(),
            body: JSON.stringify({
                "productId": props.pid
            }),
            redirect: 'follow',
            credentials: 'include' //!important
        };

        try {
            const response = await fetch(`${baseUrl}/delete`, requestOptions)
            if (isUnauthorizedStatus(response.status)) {
                clearStoredToken();
                window.location.assign("/login");
                return;
            }

            const result = await response.json();
            if (result.status) {
                toast.success("Product deleted succesfully");
                // to refresh,
                props.fetchProducts();
                // dispatch(setProducts([]));
            } else {
                toast.error("Something went wrong! try again");
                console.log('Error::Modal Delete::result', result.message)
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    return (
        <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>open modal</button> */}
            <dialog id={props.id} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{props.title}</h3>
                    <p className="py-4">{props.pid}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn mx-2 px-6 btn-sm bg-red-700 text-white" onClick={handleDelete}>yes</button>
                            <button className="btn mx-2 px-6 btn-sm">No</button>
                        </form>
                    </div>
                </div>
            </dialog>
            <Toaster />
        </div>
    )
}

export default Modal
