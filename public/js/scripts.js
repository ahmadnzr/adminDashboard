const linkto = (to) => {
  window.location = to;
};

const deleteAlert = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location = "/users/delete/" + id;
    }
  });
};

const logoutAlert = async () => {
  Swal.fire({
    title: "Are you sure?",
    text: "Logout make all your session lost!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location = "/logout";
    }
  });
};

const deleteBioAlert = async (bioId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete bio!",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location = "/users/delete/" + bioId + "/biodata";
    }
  });
};
