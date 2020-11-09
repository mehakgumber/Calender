import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import MyCalendar from './components/CalendarComponent/MyCalendar';
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import input from 'react-dom';

const localizer = momentLocalizer(moment)

const style = {
  position: "relative",
  margin: "auto",
  color: "darkblue"
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username: ""
    };

    this.controlledstateusername=(event)=>{
      this.setState({username: event.target.value});
      console.log("username: "+this.state.username)
    
          }
  }
  setDates = () => {
    const events = []
    events.map(event => {
       return events.push({
        start: new Date(event.start),
        end: new Date(event.end),
        title: `${event.pet_name} Stay (Human: ${event.human_name})`,
        allDay: true
      })
    })
    return events
  }


  onDayClick = (e, day) => {
    return(
      <div key={day}>
     <label>day: {day}</label>
     </div>
    );
    }
   
  
  
  render() {
    return (
      <div className="App">
        <MyCalendar style={style} width="1000px" 
          onDayClick={(e, day)=> this.onDayClick(e, day)}  />  
           <br></br>
               <br></br>
             <input style={style} type="text" name="Name" 
                        value={this.state.username}
                        onChange={ this.controlledstateusername}/>
            
            
          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={this.setDates()}
              startAccessor="start"
              endAccessor="end"
             />
             
          </div>
         
      </div>
    );
  }
}

export default App;
