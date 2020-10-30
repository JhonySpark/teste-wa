// A ideia era trazer as props userId, nodeId, html_url, avatar_url, login
// Porém trazendo todo o objeto de usuário eu posso trabalhar de forma melhor dentro da
// table, que foi a forma mais prática e rápida de exibir os usuários.

// A fonte de dados de usuário é renderizada dinamicamente, intercalando entre a lista de usuários
//  ativos 'Users' e a lista de usuários excluidos 'DeletedUsers' que vem do componente pai.

// aqui no componente filho, eu tentei tratar menos regras possível para que a manutenção pudesse ser feita no componente pai
// de forma mais prática, deixando o componente reutilizável.title={title}

import React from 'react'
import MaterialTable from 'material-table'
import { tableIcons } from '../assets/tableIcons'

// @props => users || deletedUsers
export default function User (props) {
  // Titulo dinâmico
  const title = props.showDeleted ? 'Lista de usuários excluidos' : 'Lista de usuários ativos'

  // Gerando as colunas da dataTable
  const collumns = [
    {
      title: 'Avatar',
      field: 'avatar_url',
      render: rowData => (
        <img src={rowData.avatar_url} style={{ width: 40, borderRadius: '50 % ' }} />
      )
    },
    { title: 'Nome', field: 'name' },
    { title: 'Login', field: 'login' },
    { title: 'Seguidores', field: 'followers' },
    { title: 'Seguindo', field: 'following' },
    { title: 'Id', field: 'id' },
    { title: 'Node Id', field: 'node_id' }
  ]

  // Passando dados para o componente pai
  function deleteUser (user) {
    props.handleDelete(user)
  }

  return (
    <>
      <MaterialTable
        title={title}
        columns={collumns}
        options={{ actionsColumnIndex: -1 }}
        data={props.data}
        icons={tableIcons}
        loading={props.loading}
        localization={{
          body: {
            emptyDataSourceMessage: props.showDeleted
              ? 'Nenhum usuário foi excluido.'
              : 'Nenhum usuário encontrado'
          }
        }}
        actions={[
          {
            icon: tableIcons.github,
            tooltip: 'Ver no GitHub',
            onClick: (event, rowData) => window.open(rowData.html_url, '_blank')
          },
          {
            icon: tableIcons.delete,
            color: '#DD1B16',
            tooltip: 'Excluir Usuário',
            onClick: (event, rowData) => deleteUser(rowData)
          }
        ]}
      />
    </>
  )
}
