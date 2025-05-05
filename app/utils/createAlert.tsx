import Swal, { type SweetAlertIcon } from "sweetalert2";


export default function createAlert(icon?: SweetAlertIcon, text?: string) {
    return Swal.fire({
        icon: icon || "info",
        text: text || "Something went wrong",
        timer: 3000,
    })
}