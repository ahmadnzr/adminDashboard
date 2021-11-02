const linkto = (to) => {
  window.location = to;
};

const deleteAlert = (id) => {
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
      deleteUser(id);
      window.location = "/users/view";
    }
  });
};

const deleteUser = async (id) => {
  return await fetch("http://localhost:3000/users/delete/" + id, {
    method: "delete",
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
      deleteSession();
      window.location = "/user/login";
    }
  });
};

const deleteSession = async () => {
  return await fetch("http://localhost:3000/logout/", {
    method: "post",
    body: {},
  });
};

const deleteBioAlert = async (bioId, userId) => {
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
      deleteBiodata(bioId);
      window.location = "/users/view/" + userId;
    }
  });
};

const deleteBiodata = async (id) => {
  return await fetch("http://localhost:3000/user/biodata/" + id, {
    method: "put",
    body: {},
  });
};
