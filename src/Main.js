import React, {useState, useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import Modal from '@material-ui/core/Modal';
import './main.css'

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    table: {
      minWidth: 700,
    },
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  function getModalStyle() {
    const top = 50
    const left = 50
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

function Main() {
  const classes = useStyles();
  const [rows, setRows] = useState([])
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [id, setId] = useState('')

  const [update, setUpdate] = useState(false)
  const [add, setAdd] = useState(false)
  const [remove, setRemove] = useState(false)

  const handleOpen = (e) => {
    if(e.target.value === "update"){
      setUpdate(true)
      setOpen(true);
    }
    else if(e.target.value === "add"){
      setAdd(true)
      setOpen(true)
    }
    else {
      setRemove(true)
      setOpen(true)
    }
  };

  const handleClose = () => {
    setId('')
    setName('')
    setUsername('')
    setEmail('')
    setPhone('')
    setWebsite('')
    setAdd(false)
    setRemove(false)
    setUpdate(false)
    setOpen(false)
  };

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users?_limit=5')
    .then(res => setRows(res.data))
  }, [])

  const handleAdd = (e) => {
    e.preventDefault()

    if(name && username && email && phone && website){
      axios.post('https://jsonplaceholder.typicode.com/users', {
        name,
        username,
        email,
        phone,
        website
      })
      .then((res) => {
        handleClose()
        setRows([...rows, res.data])
      })
      .catch(err => console.log(err))
    }
    else{
      window.alert("provide all field values")
    }

  }

  const handleDelete = (e) => {
    e.preventDefault()

    if(id){
      axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => {
        setRows(rows.filter(data => data.id != id))
        handleClose()
      })
      .catch(err => console.log(err))
    }
    else{
      window.alert("provide ID")
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    if(id && name && username && email && phone && website){
      axios.patch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        id,
        name,
        username,
        email,
        phone,
        website
      })
      .then(res => {
        const newArr = rows.filter(data => data.id != id)
        setRows([...newArr, res.data])
        handleClose()
      })
      .catch(err => console.log(err))
    }
    else{
      window.alert("provide field values")
    }
  }

    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <form>
              {
                update || remove ? <input type="text" placeholder="id" onChange={e => setId(e.target.value)} value={id} /> : null
              }
              {
                update || add ?
                (
                <>
                  <input type="text" placeholder="name" onChange={e => setName(e.target.value)} value={name} />

                  <input type="username" placeholder="username" onChange={e => setUsername(e.target.value)} value={username} />

                  <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)} value={email} />

                  <input type="text" placeholder="phone no." onChange={e => setPhone(e.target.value)} value={phone} />

                  <input type="text" placeholder="website" onChange={e => setWebsite(e.target.value)} value={website} />
                </>
                )
                : null
              }

              {
                remove ? <button onClick={handleDelete}>delete</button> : null
              }
              { update || add ?
                <button onClick={update ? handleUpdate : handleAdd}>submit</button>
                : null
              }
            </form>
          </div>
        </Modal>
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>id</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Username</StyledTableCell>
                    <StyledTableCell align="right">Email</StyledTableCell>
                    <StyledTableCell align="right">Phone</StyledTableCell>
                    <StyledTableCell align="right">Website</StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                          {row.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                          {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.username}</StyledTableCell>
                      <StyledTableCell align="right">{row.email}</StyledTableCell>
                      <StyledTableCell align="right">{row.phone}</StyledTableCell>
                      <StyledTableCell align="right">{row.website}</StyledTableCell>
                    </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        <div className="btn-ctr">
          <button onClick={handleOpen} value="add">add</button>
          <button onClick={handleOpen} value="delete">delete</button>
          <button onClick={handleOpen} value="update">update</button>
        </div>
      </div>
    )
}

export default Main
