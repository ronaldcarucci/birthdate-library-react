import { useState, useEffect } from 'react'
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Panel } from 'primereact/panel';
import { addLocale } from 'primereact/api';
import './App.css'
import { Tag } from 'primereact/tag';

function App() {
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const [date, setDate] = useState(new Date());
  const [birthdates, setBirthdates] = useState(null);
  let datesForTabs = {}

  const createDynamicTabs = () => {
    if (birthdates !== null) {
      birthdates.filter(b => b.birthdate.getMonth() === date.getMonth()).forEach(b => {
        const index = b.birthdate.getDate().toString().padStart(2, '0') + ' ' + months[b.birthdate.getMonth()]
        if (datesForTabs[index] === undefined) {
          datesForTabs[index] = [];
        }
        datesForTabs[index].push({who : b.name + ' ' + b.firstname, age: date.getFullYear() - b.birthdate.getFullYear()});
      });
      datesForTabs = Object.keys(datesForTabs).sort((a, b) => parseInt(a.split(' ')[0]) > parseInt(b.split(' '[0]))).reduce((obj, key) => { 
          obj[key] = datesForTabs[key]; 
          return obj;
        }, 
        {}
      );
      return Object.keys(datesForTabs).sort().map((d) => {
        const heads = d.split(' ');
        return (
          <AccordionTab key={d} header={<>{'' + parseInt(heads[0]).toString().padStart(2,'') + ' ' + heads[1]} <Tag severity="info" value={datesForTabs[d].length} rounded className='absolute inset-y-3 right-3 w-5 h-5'></Tag></>}>
            <ul>
              {
                datesForTabs[d].map((p, i) => {
                  return <li key={i}>{p.who} ({p.age} ans)</li>
                })
              }
            </ul>
          </AccordionTab>
        );
      });
    }
    return (<></>);
  };

  const dateTemplate = (dateTemp) => {
    const days = Object.keys(datesForTabs).map(d => parseInt(d.split(' ')[0]));
    if (days.includes(dateTemp.day) && dateTemp.month === date.getMonth()) {
        return (
            <strong className='text-orange-700'>{dateTemp.day}</strong>
        );
    }
    return dateTemp.day;
  }

  const panelHeaderTemplate = (options) => {
    const className = `${options.className}`;
    return <div className={className}>
      <span><i className='pi pi-calendar-times mr-2'/>Anniversaire du mois</span>
    </div>
    
  }

  addLocale('fr', {
      firstDayOfWeek: 1,
      showMonthAfterYear: true,
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: months,
      monthNamesShort: months,
      weak : 'Semaine',
      weekHeader: 'Sem',
      today: 'Aujourd\'hui',
      clear: 'Vider'
  });

  useEffect(() => {
    fetch('./birthdates.json')
      .then(response => response.json())
      .then(data => {
        if (data !== null) {
          data.forEach(b => {
            if (typeof (b.birthdate) === 'string') {
              let temp = b.birthdate.split('-');
              b.birthdate = new Date(parseInt(temp[0]), parseInt(temp[1])-1, parseInt(temp[2]));
            }
          });
        }
        setBirthdates(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div className="card flex justify-content-center mx-auto mt-2 w-fit">
        <div>
          <Calendar 
            value={date} 
            todayButtonClassName={null}
            view={'month'}
            onChange={(e) => setDate(e.value)} 
            inline 
            showWeek 
            locale='fr' 
            className='w-full'
            dateTemplate={dateTemplate}
          />
          <br />
          <Calendar 
            className='mt-2 without-header'
            value={date} 
            inline
            disabled={true}
            dateTemplate={dateTemplate}
            locale='fr' 
          />
        </div>
        <Divider layout="vertical" />
        <Panel header={panelHeaderTemplate} className='w-100'>
          <Accordion>{createDynamicTabs()}</Accordion>
        </Panel>
      </div>
    </>
  )
}

export default App
