import React, { Component, createRef } from 'react';
import Base from './base';
import ParticipantData from '../participantData';
import { selectedParticipant } from '../../supabaseClient';
import { getCurrentStudy } from '../participantData';
import { checkTagExists, addTag, tagData, checkStudyData, checkDataTag, removeTaggedData, deleteTag, renderTags, getParticipantData } from '../../supabaseClient';
import './participant.css';
import '../../index.css';
import ScatterChart from './ScatterChart';
import ScatterChart3D from './ScatterChart3D'; 
import { RiArrowGoBackFill } from 'react-icons/ri';


/**
 * The participant component shows the participant page which allows the user to see and modify the data of a certain participant in a certain study.
 * The user can create, delete and add tags here. They can also export and visualise the data.
 */
class Participant extends Component {
    // creating a reference for ParticipantData component
    constructor(props) {
        super(props);
        this.participantDataRef = createRef();
        this.state = {
            tags: [],
            showChart: false,
            show3DPopup: false,
        };
        this.handleGoBack = this.handleGoBack.bind(this);
    }

    /**
     * Navigates the user back to the study home page.
     */
    handleGoBack = () => {
        this.props.navigate('/studyHome', { state: { selectedStudy: getCurrentStudy() } });
    };

    /**
     * Shows a 3D visualisation of the data in a pop up window.
     */
    handleVisualise3d = () => {
        this.setState({ show3DPopup: true }); 
    }
    
    /**
     * Shows a 2D visualisation of the data in a pop up window.
     */
    handleVisualiseData = () => {
        this.setState({ showChart: true });
    }

    /**
     * Exports the data of the currently selected participant and study to the user's device as a CSV file.
     */
    handleExport = async () => {
        console.log("click!!");

        let study = getCurrentStudy();
        let pId = selectedParticipant;

        if (study === null || study === '' || pId === null || pId === '') {
            alert('Invalid Participant or Study.');
        } else {
            const data = await getParticipantData(study, pId);
            if(data.length > 0){
              
                const header = Object.keys(data[0]).join(',');
                const rows = data.map(row => Object.values(row).join(','));
                const csv = `${header}\n${rows.join('\n')}`;

                const blob = new Blob([csv], { type: 'text/csv' });
    
                const a = document.createElement('a');
                const filename = `${study}_${pId}_data.csv`;
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
    
                document.body.removeChild(a);
            } else {
                alert('No data available for the selected Participant.');
            }
        }   
    };

    /**
     * Refreshes the data on the page, allowing the user to see any recent updates made.
     */
    refreshParticipantData = () => {
        // function that calls getParticipantData from referenced ParticipantData component
        // if reference is valid
        if (this.participantDataRef.current) {
            // call getParticipantData
            this.participantDataRef.current.getParticipantData();
        }
    };

    /**
     * Handles the user adding a tag to the study.
     */
    handleCreateTag = async () => {
        let study = getCurrentStudy();

        let tagName = window.prompt("Enter the name of the new tag: ");
        if (tagName === null || tagName === "") {
            alert("You must enter a tag name.");
        }
        else if (study === null || study === "") {
            alert("Error finding study.");
        }
        else {
            const check = await checkTagExists(study, tagName);

            if (check === false) {
                const added = await addTag(study, tagName);
                if (added) {
                    alert("New tag '" + tagName + "' successfully added to the database.");
                    // refresh table and tags
                    this.refreshParticipantData();
                    this.getTags();
                }
                else {
                    alert("Error occurred while adding tag to database. Please try again.");
                }
            }
            else {
                alert("The same tag (" + tagName + ") for that study(" + study + ")  already exists.");
            }
        }
    };

    /**
     * Allows the user to delete a tag from the study and from all entries the tag is used on.
     */
    handleDeleteTag = async () => {
        let study = getCurrentStudy();

        let tagName = window.prompt("Enter the name of the tag to delete: ");
        if (tagName === null || tagName === "") {
            alert("You must enter a tag name.");
        }
        else if (study === null || study === "") {
            alert("Error finding study.");
        }
        else {
            const check = await checkTagExists(study, tagName);

            if (check === true) {
                const removed = await deleteTag(study, tagName);
                if (removed) {
                    alert("Tag '" + tagName + "' successfully deleted.");
                    // refresh table and tags
                    this.refreshParticipantData();
                    this.getTags();
                }
                else {
                    alert("Error occurred while deleting tag. Please try again.");
                }
            }
            else {
                alert("The tag (" + tagName + ") for the study(" + study + ")  does not exist.");
            }
        }
    };

    /**
     * Adds or updates the tag of an individual data entry.
     */
    handleTagData = async () => {
        // get current study as variable
        let study = getCurrentStudy();
        // ask for target tag name
        let tagName = window.prompt("Enter the name of the tag you would like to link: ");
        // null check
        if (tagName === null || tagName === "") {
            alert("You must enter a tag name.");
        }
        // tag name not null
        else {
            // prompt for data id
            let dataID = window.prompt("Enter the target data ID: ");
            // null check
            if (dataID === null || dataID === "") {
                alert("You must enter a data ID.");
            }
            // data id not null
            else {
                // check study isn't null
                const tagCheck = await checkTagExists(study, tagName);
                if (study === null || study === "") {
                    alert("Error finding study.");
                }
                // check if tag exists in database
                else if (tagCheck === true) {
                    // tag exists, check if tag for data already exists
                    const dataTagCheck = await checkDataTag(tagName, dataID);                    
                    // check if dataID for given study exists
                    const studyDataCheck = await checkStudyData(study, dataID);

                    if (dataTagCheck === tagName) {
                        // data is already tagged with tag
                        alert("Tag '"+tagName+"' already exists for DataID '"+dataID+"'.");
                    }
                    else if (studyDataCheck === false) {
                        // data does not exist in study
                        alert("DataID '"+dataID+"' does not exist for study '"+study+"'.");
                    }
                    else {
                        // tag data
                        const tagged = await tagData(tagName, dataID);
                        if (tagged === true) {
                            // successfully tagged the target dataID
                            alert("Successfully tagged '"+tagName+"' to DataID '"+dataID+"'.");
                            // refresh table
                            this.refreshParticipantData();
                        }
                        else {
                            // error occurred while tagging dataID
                            alert("An error occurred while tagging the data, please try again.");
                        }
                    }
                }
                else {
                    alert("Tag '"+tagName+"' for study '"+study+"' does not exist. Please create it first.");
                }
            }
        }
    };

    /**
     * Removes the tag from an individual data entry.
     */
    handleRemoveDataTag = async () => {
        // get current study as variable
        let study = getCurrentStudy();
        // prompt for data id
        let dataID = window.prompt("Enter the target data ID: ");
        // null check
        if (dataID === null || dataID === "") {
            alert("You must enter a data ID.");
        }
        // data id not null
        else {
            // check tagged data exists in database
            const dataCheck = await checkStudyData(study, dataID);
                // if data id does exist
                if (dataCheck === true) {
                    // remove the tag
                    const removed = await removeTaggedData(dataID);
                    // if successfully removed
                    if (removed === true){
                        alert("Successfully removed tag from DataID '"+dataID+"'.");
                        // refresh table
                        this.refreshParticipantData();
                    }
                    // if not successfully removed
                    else {
                        alert("An error occurred while removing the tag from the data, please try again.");
                    }
                }
                // if tagged data does not exist
                else {
                    alert("DataID '"+dataID+"' does not exist for study '"+study+"'.");
                }
        }

    };

    /**
     * Loads the available list of tags from the databse into the 'tags' variable.
     */
    async getTags() {
        let study = getCurrentStudy();
        let tagsData = await renderTags(study);
        this.setState({ tags: tagsData });
    }
    /**
     * Fetches available tags from the database once the Participant component has mounted.
     */
    async componentDidMount() {
        this.getTags();
    }

    render() {
        let study = getCurrentStudy();
        const { tags, showChart, show3DPopup } = this.state;

        return (
            <Base>
                <div className='mainContainerParticipant'>
                    <h1>Study: {study}</h1>
                    <div className='titleContainerParticipant'>
                        <span>Participant ID: {selectedParticipant}</span>
                        <RiArrowGoBackFill className="goBackButton" onClick={this.handleGoBack} />
                    </div>
                    <br></br>
                    <div className='entriesAndButtons'>
                        <ParticipantData currentParticipant = {selectedParticipant} ref={this.participantDataRef}/>
                        <div className='par-buttons'>
                            <button onClick={this.handleCreateTag}>Create New Tag</button>
                            <button onClick={this.handleDeleteTag}>Delete Existing Tag</button>
                            <button onClick={this.handleTagData}>Add Tag to DataID</button>
                            <button onClick={this.handleRemoveDataTag}>Remove Tag from DataID</button>
                            {/* <button onClick={this.handleRefresh}>Refresh Data</button> */}
                            <button onClick={this.handleVisualiseData}>Visualise Data</button>
                            {showChart && (
                                <div className="popup">
                                    <ScatterChart currentStudy={study} currentParticipant={selectedParticipant} />
                                    <button onClick={() => this.setState({ showChart: false })}>
                                        Close
                                    </button>
                                </div>
                            )}
                            <button onClick={this.handleVisualise3d}>3D Visulaise Data</button>
                            {show3DPopup && (
                                <div className="popup">
                                    <ScatterChart3D currentStudy={study} currentParticipant={selectedParticipant} />
                                    <button onClick={() => this.setState({ show3DPopup: false })}>
                                        Close
                                    </button>
                                </div>
                            )}
                            <button onClick={this.handleExport}>Export Data</button>
                            <br></br>
                            <h2>Available Tags:</h2>
                            <div className='tagList'>
                                <ul>{tags.length > 0 ? tags : <p>Loading...</p>}</ul>
                            </div>
                            <div className="scroll-hint">Swipe to see more →</div>
                        </div>
                    </div>
                </div>
            </Base>
        );
    }
}

export default Participant;