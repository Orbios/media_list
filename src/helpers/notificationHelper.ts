import toastr from 'toastr';

const exports = {
  message,
  error
};

toastr.options.positionClass = 'toast-bottom-left';

function message(message: string) {
  toastr.success(message);
}

function error(message: string) {
  toastr.error(message);
}

export default exports;
