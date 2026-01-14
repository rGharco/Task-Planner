'use client'

import styles from './dashboard.module.css';
import InterfaceBackground from '../../components/interface_background/interface_background'
import PageTitle from '../../components/page_title/page_title'
import TaskTable from '../../components/task_table/task_table';
import TaskTableEntry from '../../components/task_table_entry/task_table_entry';
import {Chart} from 'react-google-charts'
import {useState, useEffect} from 'react';
import api from '../../api';

// Folosit cand utilizatorul foloseste filtre, se trimite la functia loadFilteredTasks
const FilterTypes = {
    WEEK: 'week',
    TWO_WEEKS: 'two_weeks',
    MONTH: 'month',
    THREE_MONTHS: 'three_months',
    YEAR: 'year'
};

const options = {
  title: "Weekly Assigned Tasks",
  titleTextStyle: {
    color: '#ffffff', 
    fontSize: 20,   
    bold: true
  },
  backgroundColor: 'transparent', 
  chartArea: { width: '80%', height: '70%' }, 
  
  colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC'],
  
  hAxis: {
    textStyle: { color: '#ccc' }, // Culoarea textului pe axa orizontală
    gridlines: { color: 'transparent' }
  },
  vAxis: {
    textStyle: { color: '#ccc' }, // Culoarea textului pe axa verticala
    minValue: 0
  },
  legend: {
    textStyle: { color: '#ffffff' },
    position: 'bottom'
  }
};

export default function DashboardPage() {
    const [data, setData] = useState([
            ['Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        ]);
    const [tasks, setTasks] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    /** @brief: React Hook folosit pentru a incrementa zilele saptamani si a umple BarChartul. 
     *          Datele se iau print REST API.
     */
    useEffect(() => {
        async function loadWeeklyTasks() {
            try {
                // ne trebuie zilele lucratoare Luni-Vineri deci luam ziua curenta si de acolo calculam celelate zile
                // daca 0 inseamna Luni pentru getDay() atunci orice zi a saptamanii trebuie sa ajunga la 0 
                // ex: Duminica (nu e zi luccatoare) -> 6 (daca folosim getDay()) , 6-6 = 0, respectiv daca ziua e de ex 21 ianuarie
                // 21 - 6 = 15 (cea mai apropiata zi de luni)

                const currentDate = new Date();
                const dayOfWeek = currentDate.getDay(); // folosim data curenta pentru a gasi saptamana pentru care se face requestul
                const diffToMonday = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                
                const monday = new Date(); // le folosim sa dam query la API cu cele doua dati ca interval
                monday.setDate(diffToMonday);
                monday.setHours(0, 0, 0, 0); // Resetăm timpul la începutul zilei
                
                const friday = new Date(monday);
                friday.setDate(monday.getDate() + 4);
                friday.setHours(23, 59, 59, 999); // Sfârșitul zilei de vineri

                const startDate = monday.toISOString(); // pentru a fi in acelasi format cu baza de date
                const endDate = friday.toISOString();

                const response = await fetch(`${api}/api/tasks?startDate=${startDate}&endDate=${endDate}`);
                if (!response.ok) throw new Error(`Server error: ${response.status}`);
                const tasks = await response.json();

                setTasks(tasks);

                let counts = ["Tasks", 0, 0, 0, 0, 0]; // Luni - Vineri

                tasks.forEach((task) => {
                    const taskDate = new Date(task.deadline);
                    const dayIndex = taskDate.getDay(); 
                    if (dayIndex >= 1 && dayIndex <= 5) {
                        counts[dayIndex]++; 
                    }
                });

                setData([
                    ['Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    counts
                ]);
            } catch (err) {
                console.error("Error retrieving tasks:", err);
            }
        }

        loadWeeklyTasks();
    }, []); 

    async function loadFilteredTasks(filterType) {
        let endDate = new Date();
        let startDate = new Date();
        let counts = ["Tasks"];
        let header = [];

        switch (filterType) {

            case FilterTypes.WEEK: {
                startDate.setDate(endDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);

                counts.push(...Array(7).fill(0));
                header = ["Tasks","Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                break;
            }
            default:
                return;
        }

        try {
            const response = await fetch(
                `${api}/api/tasks?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const filteredTasks = await response.json();
            setTasks(filteredTasks);

            filteredTasks.forEach(task => {
                const taskDate = new Date(task.deadline);
                taskDate.setHours(0, 0, 0, 0);

                //TODO: Completeaza dashboard sa fie functional
            });

            setData([
                header,
                counts
            ]);
        }
        catch (error) {
            console.error("Error retrieving filtered tasks:", error);
        }
    }

    return (
        <>
            <PageTitle text="Dashboard"/>
            <InterfaceBackground>
                <div className='dashboard'>
                    <div className={styles.dashboardFilterSections}>
                        <input className={styles.searchBar} placeholder='Search syntax: startDate="2025-05-21" endDate="2025-05-25"'>
                        </input>
                        <div className={styles.filterWrapper}>
                            <button 
                                className={styles.filterDateBtn} 
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filter
                            </button>
                            {showFilters && (
                                <div className={styles.filterOptions}>
                                    <ul>
                                        <li>
                                            <button className={styles.filterBtn} onClick={(e) => {
                                                e.preventDefault();
                                                loadFilteredTasks(FilterTypes.WEEK);
                                            }}>Last Week</button>
                                        </li>
                                        <li>
                                            <button className={styles.filterBtn} onClick={(e) => {
                                                e.preventDefault();
                                                loadFilteredTasks(FilterTypes.TWO_WEEKS);
                                            }}>Last 2 Weeks</button>
                                        </li>
                                        <li>
                                            <button className={styles.filterBtn} onClick={(e) => {
                                                e.preventDefault();
                                                loadFilteredTasks(FilterTypes.MONTH);
                                            }}>Last Month</button>
                                        </li>
                                        <li>
                                            <button className={styles.filterBtn} onClick={(e) => {
                                                e.preventDefault();
                                                loadFilteredTasks(FilterTypes.THREE_MONTHS);
                                            }}>Last 3 Months</button>
                                        </li>
                                        <li>
                                            <button className={styles.filterBtn} onClick={(e) => {
                                                e.preventDefault();
                                                loadFilteredTasks(FilterTypes.YEAR);
                                            }}>This Year</button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <Chart className='mainChart'
                        height={400} 
                        chartType='ColumnChart'
                        data={data}
                        options={options}
                        >
                    </Chart>
                </div>
                <div className={styles.taskTable}>
                    <TaskTable>
                        {tasks.map((task) => ( 
                            <TaskTableEntry 
                                key={task.id}
                                id={task.id} 
                                title={task.title} 
                                description={task.description}
                                status={task.status}
                                deadline={task.deadline}
                                category={task.category}
                            />
                        ))}
                    </TaskTable>
                </div>
            </InterfaceBackground>
        </>
    )
}