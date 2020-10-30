import './App.css'
import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import LinearProgress from '@material-ui/core/LinearProgress'
import User from './components/User.js'
import axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar'

export default function App () {
  const [loading, setLoading] = useState({ open: false, msg: '' })
  const [showDeleted, setShowDeleted] = useState(false)
  const [users, setUsers] = useState([])
  const [deletedUsers, setDeletedUsers] = useState([])
  const [snack, setOpen] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    msg: '',
    bg: 'black'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  // Faz a call na api do GitHub e traz os usuários.
  async function loadUsers () {
    setLoading({ open: true, msg: 'Carregando usuários...' })
    const { data } = await axios.get('https://api.github.com/users')
    /*
    Utilizei uma api adicional, que me dá todos os detalhes do usuário em uma chamada única, no endpoint de cima
    tráz os dados de forma limitada, dai eu teria que fazer duas chamadas adicionais para trazer os followers e followings.
    desta forma, eu utilizo uma map promise para fazer um master detail com a lista de usuários principal e também para limitar
    a quantidade de usuários com o splice.
    */
    const usersList = []
    const mapPromise = data.splice(0, 10).map(async (item) => {
      const userDetail = await axios.get(`https://api.github.com/users/${item.login}`)
      return usersList.push(userDetail.data)
    })

    // aqui eu resolvo meu map promise e seto o estado com a lista dos 10 usuários.
    Promise.all(mapPromise).then(() => {
      setUsers(usersList)
      setLoading({ open: false })
    })
  }

  const deleteUser = (item) => {
    // Verifico se meu array de usuários excluidos já tem o usuário do contexto atual.
    if (deletedUsers.includes(item)) {
      return setOpen({
        ...snack,
        open: true,
        msg: 'Este usuário já foi excluido.',
        bg: 'orange'
      })
    }
    setLoading({ open: true, msg: 'Excluindo usuário' })

    // retiro os arrays do state
    const usersList = [...users]
    const deletedUsersList = [...deletedUsers]
    // retiro o usuário da lista de ativos pelo index.
    usersList.splice(users.indexOf(item), 1)
    // insiro o usuário na lista de excluidos.
    deletedUsersList.push(item)

    // volto os arrays tradados para o state.
    setDeletedUsers(deletedUsersList)
    setUsers(usersList)
    setLoading({ open: false })

    // apresento uma mensagem de exclusão.
    return setOpen({
      ...snack,
      open: true,
      msg: 'Usuário excluido com sucesso!',
      bg: 'green'
    })
  }

  // estilos padrões do material-ui
  const useStyles = makeStyles((theme) => ({
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
      marginTop: theme.spacing(4)
    },
    cardGrid: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6)
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      borderRadius: 6,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4, 4, 2),
      alignItems: 'center',
      justifyContent: 'center'
    },
    snack: {
      background: snack.bg
    }
  }))
  // instância do useStyles.
  const classes = useStyles()

  // dados do Copyright que tráz o ano dinamico.
  function Copyright () {
    return (
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link color='inherit' href='https://www.linkedin.com/in/jhonatanciriaco/'>
          JhonySpark
        </Link>{' '}
        {new Date().getFullYear()}
        .
      </Typography>
    )
  }
  return (
    <>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth='lg'>
            <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
              Teste Wa Project
            </Typography>
            <Typography variant='h5' align='center' color='textSecondary' paragraph>
              Este é um teste prático em react, onde exibo uma lista de 10 usuários do github, seguindo as instruções contidas no e-mail.
              Tentei fazer de forma simples e prática com um pouquinho de carisma ( risos ), por isso utilizei o Material-ui e a Material table.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify='center'>
                <Grid item>
                  <Button variant='contained' color={showDeleted ? 'primary' : 'secondary'} onClick={() => showDeleted ? setShowDeleted(false) : setShowDeleted(true)}>
                    {!showDeleted ? 'Ver usuários excluidos' : 'Ver Usuários ativos'}
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        {/* Chamada do componente User */}
        <Container className={classes.cardGrid} maxWidth='lg'>
          <User
            data={showDeleted ? deletedUsers : users}
            loading={loading.open}
            showDeleted={showDeleted}
            handleDelete={(user) => deleteUser(user)}
          />
        </Container>
      </main>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant='h6' align='center' gutterBottom>
          Made to the sound of Vintage Culture ♫.
        </Typography>
        <Typography variant='subtitle1' align='center' color='textSecondary' component='p' />
        <Copyright />
      </footer>
      {/* End footer */}

      {/*   Modal de loading */}
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={loading.open}
        onClose={() => setLoading({ open: false })}
        closeAfterTransition
      >

        <div className={classes.paper}>
          <LinearProgress />
          <p id='transition-modal-description'>{loading.msg}.</p>
        </div>
      </Modal>

      {/* corpo do snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        ContentProps={{
          classes: {
            root: classes.snack
          }
        }}
        open={snack.open}
        onClose={() => setOpen({ ...snack, open: false })}
        message={snack.msg}
        autoHideDuration={5000}
      />
    </>
  )
}
