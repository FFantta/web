import React, { Component } from 'react';
import Base from './base';
import StudyDropdown from '../studyDropdown';
import Database from '../database';
import { getStudyData } from '../../supabaseClient';
import './studyhome.css';
import '../../index.css';
import { getCurrentStudy } from '../participantData';
import ScatterChart from './ScatterChart'; 
import { supabase } from '../../supabaseClient'; 
import ScatterChart3D from './ScatterChart3D'; // 确保路径正确



class StudyHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStudy: 'No Study Selected',
            showPopup: false, 
            show3DPopup: false,
        };
    }

    handleVisualise3d = () => {
        this.setState({ show3DPopup: true }); // 设置状态以显示3D图表
    }

    handleStudyChange = (currentStudy) => {
        this.setState({currentStudy});
    }

    handleVisualise = () => {
        this.setState({ showPopup: true }); 
    }


    handleExport = async () => {
        console.log("click!!");

        let study = getCurrentStudy();

        if (study === null || study === '') {
            alert('You must select a study.');
        } else {
            const data = await getStudyData(study);
            if(data.length > 0){
              
                const header = Object.keys(data[0]).join(',');
                const rows = data.map(row => Object.values(row).join(','));
                const csv = `${header}\n${rows.join('\n')}`;

                const blob = new Blob([csv], { type: 'text/csv' });
    
                const a = document.createElement('a');
                const filename = `${study}_data.csv`;
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
    
                document.body.removeChild(a);
            } else {
                alert('No data available for the selected study.');
            }
        }   
    };
       

    render() {
        const { currentStudy, showPopup } = this.state;
        return (
            <Base>
                <div className='mainContainerStudy'>
                    <div className='titleContainerStudy'>Study Home</div>
                    <br></br>
                    <StudyDropdown onSelect={this.handleStudyChange} />
                    <br></br>
                    <div className='tableAndButtons'>
                        <Database currentStudy={currentStudy} />
                        <div className='buttons'>
                            <button onClick={this.handleVisualise}>Visualise Data</button>
                            {showPopup && (
                                <div className="popup">
                                    <ScatterChart currentStudy={currentStudy} />
                                    <button onClick={() => this.setState({ showPopup: false })}>
                                        Close
                                    </button>
                                </div>
                            )}
                            <button onClick={this.handleVisualise3d}>3D Visulaise Data</button>
                            {this.state.show3DPopup && (
                                <div className="popup">
                                    <ScatterChart3D currentStudy={this.state.currentStudy} />
                                    <button onClick={() => this.setState({ show3DPopup: false })}>
                                        Close
                                    </button>
                                </div>
                            )}
                            <button onClick={this.handleExport}>Export Data</button>
                        </div>
                    </div>
                </div>
            </Base>
        );
    }
}

export default StudyHome;