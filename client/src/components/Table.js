import React, { useEffect, useState, useRef } from "react";
import CreateIcon from "@material-ui/icons/Create";
import {
  Box, Button, Snackbar, Table,
  TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { AlignCenter } from "react-bootstrap-icons";
import { NavBar } from "./NavBar";
import { useLocation } from 'react-router-dom'
import Axios from "axios"

// Creating styles
const useStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  table: {
    marginRight: 0,
    minWidth: 650,
  },
  snackbar: {
    bottom: "104px",
  },
});







function Tabledemo() {



  const location = useLocation();
  const langcode = location.pathname.split('/')[3];
  console.log("location", location.state.items.translations[langcode]);
  const jsonlangfetched = location.state.items.translations[langcode];
  const { from } = location.state
  // Creating style object
  const classes = useStyles();

  // Defining a state named rows
  // which we can update by calling on setRows function
  const [rows, setRows] = useState([
    // { id: 1, key: "", value: "" },
  ]);

  // Initial states
  const [open, setOpen] = React.useState(false);
  const [isEdit, setEdit] = React.useState(false);
  const [disable, setDisable] = React.useState(true);
  const [showConfirm, setShowConfirm] = React.useState(false);
  // const firstUpdate = useRef(true);
  const currlang = location.pathname.split('/')[3];
  const [trigger, settrigger] = useState(-1);
  var thisjson = {};
  // const [fintrans,setfintrans]=React.useState({});
  var fintrans = {};
  var outputtrans = {};

  useEffect(() => {

    console.log("inside useffect", jsonlangfetched);

    Object.entries(jsonlangfetched).map(([key, value]) => {
      console.log(key);
      setRows([
        ...rows,
        {
          id: rows.length + 1, key: key,
          value: value
        },
      ]);
    })
  }, [])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Function For adding new row object
  const handleAdd = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1, key: "",
        value: ""
      },
    ]);
    setEdit(true);
  };

  // Function to handle edit
  const handleEdit = (i) => {
    setEdit(!isEdit);
  };

  // Function to handle save
  const handleSave = () => {
    console.log("prop", location.pathname.split('/')[3]);
    setEdit(!isEdit);
    setRows(rows);
    console.log("saved : ", rows);
    // setthisjson([]);
    for (var i = 0; i < rows.length; i++) {
      thisjson[rows[i].key] = rows[i].value;
    }


    fintrans[location.pathname.split('/')[3]] = JSON.stringify(thisjson);

    setDisable(true);
    setOpen(true);
    let translateFrom = 'en'
    var trns = {};
    console.log(location.state.items.Languages)


    rows.map((row, i) => {
      // console.log("map try",row);
      trns[row.key] = row.value;
    })

    outputtrans["en"] = trns;

    var bar = new Promise((resolve, reject) => {
      location.state.items.Languages.map((lang, i) => {

        console.log("inside lanf ap", lang);
        let translateTo = lang.value;
        trns = {};


        rows.map((row, j) => {
          // trns[row.key]="KOOOOr";
          console.log("map ke andar", i);
          const k = row.key;
          let apiurl = `https://api.mymemory.translated.net/get?q=${row.value}&langpair=${translateFrom}|${translateTo}`;
          Axios.get(apiurl).then(res => {
            trns[row.key] = res.data.responseData.translatedText;
            console.log(res.data.responseData.translatedText);
            if(j==rows.length-1) resolve(1);
          }).catch(err => {
            console.log("error occurred in translation mymory.translated api", err);
          });
        })

        outputtrans[translateTo] = trns;
        
      })
      
    })

    bar.then(() => {
      console.log("Axios call", outputtrans);

      Axios.post('/api/projects/update/', {
        _id: location.state.items._id,
        PName: location.state.items.PName,
        date: location.state.items.date,
        Languages: location.state.items.Languages,
        translations: outputtrans

      }).then(res => {
        console.log("updated successfully");
      }).catch(err => {
        console.log("updation of project was unsuccessful", err);
      })
    })

  };


  const handleInputChange = (e, index) => {
    setDisable(false);
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setRows(list);
  };

  // Showing delete confirmation to users
  const handleConfirm = () => {
    setShowConfirm(true);
  };

  // Handle the case of delete confirmation where 
  // user click yes delete a specific row of id:i
  const handleRemoveClick = (i) => {
    const list = [...rows];
    list.splice(i, 1);
    setRows(list);
    setShowConfirm(false);
  };

  // Handle the case of delete confirmation 
  // where user click no 
  const handleNo = () => {
    setShowConfirm(false);
  };



  return (
    <>
      <NavBar />
      <TableBody className="tablebody">

        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          className={classes.snackbar}
        >
          <Alert onClose={handleClose} severity="success">
            Record saved successfully!
          </Alert>
        </Snackbar>
        <Box margin={1}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {isEdit ? (
                <div>
                  <Button onClick={handleAdd}>
                    <AddBoxIcon onClick={handleAdd} />
                    ADD
                  </Button>
                  {rows.length !== 0 && (
                    <div>
                      {disable ? (
                        <Button disabled align="right" onClick={handleSave}>
                          <DoneIcon />
                          SAVE
                        </Button>
                      ) : (
                        <Button align="right" onClick={handleSave}>
                          <DoneIcon />
                          SAVE
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Button onClick={handleAdd}>
                    <AddBoxIcon onClick={handleAdd} />
                    ADD
                  </Button>
                  <Button align="right" onClick={handleEdit}>
                    <CreateIcon />
                    EDIT
                  </Button>
                </div>
              )}
            </div>
          </div>
          <TableRow align="center"> </TableRow>

          <Table
            className={classes.table}
            size="small"
            aria-label="a dense table"
          >
            <TableBody>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell align="left">Value</TableCell>
              </TableRow>
            </TableBody>

            <TableBody>
              {rows.map((row, i) => {
                return (
                  <div>

                    {isEdit ? (
                      <TableRow>
                        <TableCell padding="none">
                          <input
                            value={row.key}
                            name="key"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </TableCell>
                        <TableCell>           </TableCell>
                        <TableCell padding="none" >
                          <input
                            style={{ width: "700px" }}
                            value={row.value}
                            name="value"
                            onChange={(e) => handleInputChange(e, i)}
                          />
                        </TableCell>

                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.key}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.value}
                        </TableCell>

                      </TableRow>
                    )}
                    {isEdit ? (
                      <Button className="mr10" onClick={handleConfirm}>
                        <ClearIcon />
                      </Button>
                    ) : (
                      <Button className="mr10" onClick={handleConfirm}>
                        <DeleteOutlineIcon />
                      </Button>
                    )}
                    {showConfirm && (
                      <div>
                        <Dialog
                          open={showConfirm}
                          onClose={handleNo}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Confirm Delete"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure to delete
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => handleRemoveClick(i)}
                              color="primary"
                              autoFocus
                            >
                              Yes
                            </Button>
                            <Button
                              onClick={handleNo}
                              color="primary"
                              autoFocus
                            >
                              No
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    )}

                  </div>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </TableBody>
    </>
  );
}

export default Tabledemo;