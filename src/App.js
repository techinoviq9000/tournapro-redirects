import React from 'react'
import './App.css';
import TournaPro_Icon from './images/TournaPro_Icon.png'
// import Header from './components/Header'

const App = () => {
  return(
    <div>
    <center>
    <div className='container'>
      <img style={{width:"200px", height:"200px"}}src={TournaPro_Icon} alt="logo"/>
      <h1>Congratulations!</h1>
      <div>
      <h2>You have been registered.</h2>
      </div>
      <p>You may close the window and login from the TournaPro mobile app.</p>

    </div>
    </center>
    </div>
    


    
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