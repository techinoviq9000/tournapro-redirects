import React from 'react'
import './App.css';
import Header from './components/Header'

const App = () => {
  return(
    <center>
    <div className='container'>
      <h1>Congratulations!</h1>
      <div>
      <h2>You have been registered.</h2>
      </div>
      <a href="https://techinoviq.com">Continue to your app</a>

      <div className="footer">
        <p>Powered by TournaPro</p>
      </div>
    </div>
    </center>
    


    
  )
}

export default App

// const name = "Brad"
// const x = "false"

// function App() {
//   return (
//     <div className="App-header">
//       <header>
//        <h1>Speed Demon {1+1}</h1>
//         <h2>Hello {x ? 'Yes': 'No'}</h2>
//         <h3>{name}</h3>
//       </header>
//     </div>
//   );
// }

// export default App;


// class App extends React.Component{
//   render(){
//     return <h1><center>Hello world and all the people living in it! You all matter!</center></h1>
//   }
// }

// export default App