App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (typeof window.web3 !== 'undefined') {
      App.web3Provider = window.ethereum
      window.web3 = new Web3(window.ethereum)
    } else {
      window.alert('Please connect to Metamask')
    }
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      window.web3 = new Web3(window.ethereum)
    } else {
      console.log('Non-Ethereum browser detected.')
    }
  },

  loadAccount: async () => {
    const accounts = await window.web3.eth.getAccounts()
    App.account = accounts[0]
  },

  loadContract: async () => {
    // JS version of contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    if (App.loading) {
      return
    }

    App.setLoading(true)

    $('#account').html(App.account)

    App.setLoading(false)
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})
