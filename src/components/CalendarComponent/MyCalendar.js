import React, {Component} from 'react';
import moment from 'moment';
import './calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
const events=[{name:'', description:''}]
        
      
class MyCalendar extends React.Component{
    
    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDay: null,
        selectedyear:null,
        selectedMonth:null,
        flag: false,
    
    }
 
    constructor(props) {
        super(props);
        this.width = props.width || "1000px";
        
        this.style = props.style || {};
        this.style.width = this.width; // add this

        this.controlledstatename=(event)=>{
            this.setState({name: event.target.value});
            console.log("name: "+this.state.name)
          
                }
        
        this.controlledstatedes=(event)=>{
            this.setState({des: event.target.value});
            console.log("description: "+this.state.des)
     
        }
        
    }


    weekdays = moment.weekdays(); //["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"]
    weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        console.log("currentDate: ", this.state.dateContext.get("date"));
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("D");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); // Day of week 0...1..5...6
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext,
            selectedMonth: monthNo
        });
        console.log("month", this.state.selectedMonth);
    }

    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();

    }
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}}>
                        {data}
                    </a>
                </div>
            );
        });

        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
            </span>
        );
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext,
            selectedyear: year
        }, () => {
            console.log( "context:", this.state.selectedyear);
           
        });

       
    }
    onYearChange = (e) => {
        this.setYear(e.target.value);
         
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }
    

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }

  
    YearNav = () => {
        return (
            this.state.showYearNav ?
            <input
                defaultValue = {this.year()}
                className="editor-year"
                ref={(yearInput) => { this.yearInput = yearInput}}
                onKeyUp= {(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                type="number"
                placeholder="year"/>
            :
            <span
                className="label-year"
                onDoubleClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    }

    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day,
            flag: true,
           
        }, () => {
            console.log("SELECTED DAY: ", this.state.selectedDay);
            
        });
        this.setState({[e.target.name]: e.target.value});
        events.splice(0,1);
        events.push({
            
            name: this.state.name,
            description: this.state.des
          
          })
           console.log("events",events);

        this.props.onDayClick && this.props.onDayClick(e, day);
    }
    

    render() {
   
        
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });
       
        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }

     

        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == this.currentDay() ? "day current-day": "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            daysInMonth.push(
                <td key={d} className={selectedClass}>
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
                </td>
              
            );
           
        }


        

        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });
        let trElemday = rows.map((d, i) => {
          
           
            return (   

                <tr key={i*100} > 
                  {d}
                
                </tr>
                   
            );
        })
       
        

        return (
            <div>
            <div className="calendar-container" style={this.style}>
               
                 
                <table className="calendar">
                    <thead>
                        <tr className="calendar-header">
                            <td colSpan="5">
                                <this.MonthNav />
                                {" "}
                                <this.YearNav />
                            </td>
                            <td colSpan="2" className="nav-month">
                                <i className="prev fa fa-fw fa-chevron-left"
                                    onClick={(e)=> {this.prevMonth()}}>
                                </i>
                                <i className="prev fa fa-fw fa-chevron-right"
                                    onClick={(e)=> {this.nextMonth()}}>
                                </i>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {weekdays}
                        </tr>
                    
                        {trElemday}
                        
                    </tbody>
                </table>
                </div>
                <div className={!this.state.flag ? "hidediv" : ""}>
                   
                      <div>{ 
                          this.state.selectedDay+"/"+this.state.selectedMonth+"/"+this.state.selectedyear }
                          <br></br>
                           <label>Name:  </label>
                                    <input name="Name" type="text"
                                    value={this.state.name}
                                    onChange={ this.controlledstatename}/>
                                    <br>
                                    </br><br></br>
                            <label>Description:  </label>
                                    <input name="Des" type="text"
                                    value={this.state.des}
                                    onChange={ this.controlledstatedes}/>
                                    <br>
                                    </br><br></br>
                                
                       </div>
                    <div className={!this.state.flag ? "hidediv" : ""}>{
                      events.map((event) => {
                     
                                return (
                                   
                                      <td>
                                           
                                            
                                            name:{event.name},
                                           description:{event.description}
                                           
                                       </td>
                                           
                                    )
                         })
                        }
                    </div>
      
        </div>     
            </div>

        );
    }
}
export default MyCalendar;