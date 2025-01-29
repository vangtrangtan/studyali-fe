import { useState } from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

function ConfirmationDialog(props) {
  //local states
  const [open, setOpen] = useState(false);

  const showDialog = () => {
    setOpen(true);
  };

  const hideDialog = () => {
    setOpen(false);
  };

  const confirmRequest = () => {
    props.response();
    hideDialog();
  };

  return (
    <>
      {props.children(showDialog)}
      {open && (
        <Dialog
          open={open}
          onClose={hideDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent style={{width:"300px"}}>
            <DialogContentText id="alert-dialog-description">
            Are you sure ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={confirmRequest} color="primary">
              Yes
            </Button>
            <Button onClick={hideDialog} color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default ConfirmationDialog;

// function Demo() {
//   const handleConfirmation = () => {
//     // Perform action upon confirmation
//     console.log('Confirmed!');
//   };

//   return (
//     <ConfirmationDialog
//       title="Confirmation"
//       description="Are you sure ?"
//       response={handleConfirmation}
//     >
//       {(showDialog) => (
//         <button onClick={showDialog}>Open Confirmation Dialog</button>
//       )}
//     </ConfirmationDialog>
//   );
// }
