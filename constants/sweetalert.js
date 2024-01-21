const { default: Swal } = require("sweetalert2");

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function ToastInfo(title, html) {
  Toast.fire({
    icon: "info",
    title,
    html: html ? html : "",
  });
}

export function ToastSuccess(title) {
    Toast.fire({
      icon: "success",
      title
    });
  }
