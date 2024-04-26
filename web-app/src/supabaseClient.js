import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const supabaseUrl = "https://uyjpltlosfpmsgjxnvmm.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5anBsdGxvc2ZwbXNnanhudm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMDMyMjEsImV4cCI6MjAyMzU3OTIyMX0.hWr6Bj4EtDrVnB9nWpc--GuPKpmVqGGZW9uMovyWrmo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export let selectedParticipant = null;

/**
 * Sets the ID of the selected participant (which changes throughout the use of the program) to ensure the correct data is fetched.
 * @param {number} num - the ID of the participant
 */
function setSelectedParticipant(num) {
    selectedParticipant = num;
}

/**
 * Checks whether the given admin ID and password are a valid pair in the database.
 * @param {number} adminId - the ID of the admin
 * @param {string} adminPassword - the password associated to the admin ID
 * @returns -  true if the admin credentials are valid, and false if not.
 */
export async function checkAdminCredentials(adminId, adminPassword) {
    try {
        let { data, error } = await supabase
            .from("AdminTable")
            .select("AdminID, AdminPassword")
            .eq("AdminID", adminId)
            .single();

        if (error) {
            throw error;
        }

        if (data) {
            // Admin ID exists in database
            if (data.AdminPassword === adminPassword) {
                // Password is correct
                return true;
            } else {
                // Password is incorrect
                return false;
            }
        } else {
            // Admin ID not in database
            console.log("Admin ID not found.");
            return false;
        }
    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return false;
    }

}

/**
 * Checks whether the role associated to the given admin ID is the admin role or not.
 * @param {number} adminId - the ID of the admin
 * @returns - true or false depending on whether the admin ID is an admin role or not
 */
export async function checkForAdminRole(adminId) {
    try {
        let {data, error} = await supabase
            .from("AdminTable")
            .select("AdminID, Role")
            .eq("AdminID", adminId)
            .single();

        if (error) {
            throw error;
        }

        if (data) {
            // Admin ID exists in database
            if (data.Role === "Admin") {
                // Password is correct
                return true;
            } else {
                // Password is incorrect
                return false;
            }
        } else {
            // Admin ID not in database
            console.log("Admin ID not found in database");
            return false;
        }
    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return false;

    }
}

/**
 * Creates a new admin and inserts it into the database. Returns the new admin ID.
 * @param {string} adminPassword - the password to be set for the new admin.
 * @param {string} adminRole - the role to be set for the new admin.
 * @returns - new admin ID if the new admin is successfully created, false if not.
 */
export async function insertAdmin(adminPassword, adminRole) {
    try {
        let { data, error } = await supabase
            .from('AdminTable')
            .insert([{ AdminPassword: adminPassword, Role: adminRole }])
            .select("AdminID")
            .eq("AdminPassword", adminPassword)
            .single();

        if (error) {
            throw error;
        }

        return data.AdminID;

    } catch (error) {
        console.error("Error inserting admin: " + error.message);
        return false;
    }
}

/**
 * Checks if the given study name already exists in the database.
 * @param {string} studyName - the name of the study to be checked.
 * @returns - true if the study name is already in the database, and false if not.
 */
export async function checkStudyExists(studyName) {
    try {
        const { data, error } = await supabase
            .from('StudyTable')
            .select('StudyID')
            .eq('StudyID', studyName);

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            // study already exists
            return true;
        }
        else {
            // study does not exist
            return false;
        }
        
    } catch (error) {
        console.error('Error checking study: ' + error.message);
        return false;
    }
}

/**
 * Inserts a new study into the database if it does not already exist.
 * @param {string} studyName - name of the study to be inserted into the database.
 * @returns - true if the study is successfully inserted into the database, false if not.
 */
export async function insertStudy(studyName) {
    const exists = await checkStudyExists(studyName);

    if (!exists) {
        try {
            let { error } = await supabase
                .from('StudyTable')
                .insert([{ StudyID: studyName }]);

            if (error) {
                throw error;
            }
            return true;

        } catch (error) {
            console.error("Error inserting study: " + error.message);
        }        
    }
    else if (exists) {
        alert('This study already exists.');
        return false;
    }
}

/**
 * Returns all the data entries of a given study in the database in ascending order of DataID, as a HTML table.
 * @param {number} studyID - the study ID of the entries to be returned.
 * @returns - a HTML table with all the target entries found in the database, if no entries are found then 'No study data found' is returned. 
 */
export async function renderStudyDatabase(studyID) {
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)
            .order("DataID", {ascending: true});

        // throw error if error returned
        if (error) {
            throw error;
        }

        // render the database
        if (data.length > 0) {
            return(
                <table className='databaseTable'>
                    <thead>
                        {/* header row */}
                        <tr>
                            {/* <th>DataID</th> */}
                            <th>ParticipantID</th>
                            <th>Xcoordinate</th>
                            <th>Ycoordinate</th>
                            <th>Timestamp</th>
                            <th>Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data.map((row) => {
                        const formattedX = parseFloat(row.Xcoordinate).toFixed(2);
                        const formattedY = parseFloat(row.Ycoordinate).toFixed(2);
                        return(
                            <tr key={row.DataID}>
                                <td>
                                    <Link to='/participant' onClick={() => setSelectedParticipant(row.ParticipantID)}>
                                        <button id='participantButton'>{row.ParticipantID}</button>
                                    </Link>
                                </td>
                                <td>{formattedX}</td>
                                <td>{formattedY}</td>
                                <td>{row.Timestamp}</td>
                                <td>{row.Tag}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ); 
        }
        // no data exists for the study
        else {
            return(
                <h3>'No study data found.'</h3>
            );   
        }

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return [];
    }
}

/**
 * Gets all the data entries of a given study from the database.
 * @param {number} studyID - the study ID of the entries to be returned.
 * @returns - the data entries from the given study as a single variable.
 */
export async function getStudyData(studyID) {
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)

        if (error) {
            throw error;
        }
        if (data.length > 0){
            return data;
        }
        else {
            return null
        };

    }
    catch(e){
        console.error("Error: Exception: " + e.message, e);
        return null;
    }
}

/**
 * Gets all the data entries of a given participant in a given study from the database.
 * @param {number} studyID - the study ID of the study that the participant is in.
 * @param {number} pID - the ID of the target participant.
 * @returns - the data entries from the given particpant and study as a single variable.
 */
export async function getParticipantData(studyID, pID){
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)
            .eq("ParticipantID", pID);

        if (error) {
            throw error;
        }

        if(data.length > 0){
            return data;
        }
        else {
            return null
        };

    }
    catch(e){
        console.error("Error: Exception: " + e.message, e);
        return null;
    }
}

/**
 * Returns all the data entries of a given participant in a given study in the database in ascending order of DataID, as a HTML table.
 * @param {number} studyID - the study ID of the study that the participant is in.
 * @param {number} pID - the ID of the target participant.
 * @returns - a HTML table with all the target entries found in the database, if no entries are found then 'No study data found' is returned. 
 */
export async function renderParticipantDatabase(studyID, pID) {
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)
            .eq("ParticipantID", pID)
            .order("DataID", {ascending: true});;

        if (error) {
            throw error;
        }

        // render the database
        if (data.length > 0) {
            return(
                <table className='entryTable'>
                    <thead>
                        {/* header row */}
                        <tr>
                            <th>DataID</th>
                            <th>Xcoordinate</th>
                            <th>Ycoordinate</th>
                            <th>Timestamp</th>
                            <th>Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    {data.map((row) => {
                        const formattedX = parseFloat(row.Xcoordinate).toFixed(2);
                        const formattedY = parseFloat(row.Ycoordinate).toFixed(2);
                        return(
                            <tr key={row.DataID}>
                                <td>{row.DataID}</td>
                                <td>{formattedX}</td>
                                <td>{formattedY}</td>
                                <td>{row.Timestamp}</td>
                                <td>{row.Tag}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ); 
        }
        // no data exists for the study
        else {
            return(
                <h3>'No study data found.'</h3>
            );   
        }

    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}

/**
 * Creates a dropdown including all of the names of studies available in the database.
 * @returns - a HTML dropdown menu of all the study names found.
 */
export async function renderDropdownStudies() {
    try {
        let { data, error } = await supabase
            .from("StudyTable")
            .select("StudyID");

        // throw error if error returned
        if (error) {
            throw error;
        }

        // render the studies
        if (data && data.length > 0) {
            return data.map(row => (
                <option key={row.StudyID} value={row.StudyID}>{row.StudyID}</option>
            ));
        }
        // error return
        else {
            return <option value="error">No Studies Found</option>;
        }

    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}


/**
 * Returns the entries from the database with data IDs matching that of the search text.
 * @param {number} studyID - the study ID to be searched.
 * @param {string} text - the string the user enetered in the search bar.
 * @returns - a HTML table with all the target entries found in the database, if no entries are found then 'No study data found' is returned. 
 */
export async function renderSearchResults(studyID, text) {
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)
            .eq("ParticipantID", text)
            .order("DataID", {ascending: true});;

        // throw error if error returned
        if (error) {
            throw error;
        }

        // render the database
        if (data.length > 0) {
            return(
                <table className='databaseTable'>
                    <thead>
                        {/* header row */}
                        <tr>
                            <th>DataID</th>
                            <th>ParticipantID</th>
                            <th>Xcoordinate</th>
                            <th>Ycoordinate</th>
                            <th>Timestamp</th>
                            <th>Tag</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                    {data.map((row) => {
                        return(
                            <tr>
                                <td>{row.DataID}</td>
                                <td>
                                    <Link to='/participant' onClick={() => setSelectedParticipant(row.ParticipantID)}>
                                        <button id='participantButton'>{row.ParticipantID}</button>
                                    </Link>
                                </td>
                                <td>{row.Xcoordinate}</td>
                                <td>{row.Ycoordinate}</td>
                                <td>{row.Timestamp}</td>
                                <td>{row.Tag}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            ); 
        }
        // no data exists for the study
        else {
            return(
                <h3>'No study data found.'</h3>
            );   
        }

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
    }
}

/**
 * Checks if the tag to be added already exists for the given study.
 * @param {string} study - the study ID where the tag needs to be added.
 * @param {string} tag - the name of the tag to be checked.
 * @returns - true if the tag already exists, false if not.
 */
export async function checkTagExists(study, tag) {    
    try {
        // check if tag and study already exist
        let { data, error } = await supabase
            .from("TagTable")
            .select("*")
            .eq("StudyID", study)
            .eq("TagName", tag);

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            // tag is in database
            return true;
        }
        else {
            // tag is not in database
            return false;
        }

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Adds a new tag for the given study in the database.
 * @param {string} study - the study ID that the tag will be associated with.
 * @param {string} tag - the name of the tag to be added.
 * @returns - true if the tag has been successfully added to the databsse, false if not.
 */
export async function addTag(study, tag) {
    try {
        let { error } = await supabase
            .from("TagTable")
            .insert([{TagName: tag, StudyID: study}]);

        // throw error if error returned
        if (error) {
            throw error;
        }

        return true;

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Checks if a data entry is already tagged with a given tag.
 * @param {string} tag - the name of the tag to be checked.
 * @param {number} dataID - the ID of the data entry to be checked.
 * @returns - the tag name if the data entry is tagged with the given tag, null if not.
 */
export async function checkDataTag(tag, dataID) {
    try {
        // check if tag and study already exist
        let { data, error } = await supabase
            .from("MoodDataTable")
            .select("Tag")
            .eq("DataID", dataID)
            .eq("Tag", tag)
            .single();

        if (error) {
            throw error;
        }

        if (data) {
            return data.Tag;
        }
        else {
            return null;
        }

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return null;
    }
}

/**
 * Checks if a given data ID exists in a given study.
 * @param {string} study - the name of the study to be checked.
 * @param {number} dataID - the data ID to be checked in the study.
 * @returns - true if the tagged data already exists for the study, false if not.
 */
export async function checkStudyData(study, dataID) {
    try {
        // check if tag and study already exist
        let { data, error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("DataID", dataID)
            .eq("StudyID", study);

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            // tagged data already exists
            return true;
        }
        else {
            // tagged data does not exist
            return false;
        }

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Updates the tag for a given data entry.
 * @param {string} tag - the name of the new tag.
 * @param {number} dataID - the data ID where the tag will be updated.
 * @returns - true if the tag is successfully updated, false if not.
 */
export async function tagData(tag, dataID) {
    try {
        // add tag to database
        let { error } = await supabase
            .from("MoodDataTable")
            .update({ Tag: tag })
            .eq("DataID", dataID);

        // throw error if error returned
        if (error) {
            throw error;
        }
        
        // successfully added
        return true;


    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Removes the tag from a data entry by making it null.
 * @param {number} dataID - the data ID where the tag needs to be removed.
 * @returns - true if the tag is successfully removed, false if not.
 */
export async function removeTaggedData(dataID) {
    try {
        // remove tag from database
        let { error } = await supabase
            .from("MoodDataTable")
            .update({ Tag: null })
            .eq("DataID", dataID);

        // throw error if error returned
        if (error) {
            throw error;
        }
        
        // successfully removed
        return true;


    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Deletes a tag from a study, and updates the tag of entries with the deleted tag to null. 
 * @param {string} study - the study where the tag will be deleted from.
 * @param {string} tag - the tag to be deleted.
 * @returns - true if the tag is successfully deleted from the study, false if not.
 */
export async function deleteTag(study, tag) {
    try {
        // delete tag from database
        let { error } = await supabase
            .from("TagTable")
            .delete()
            .eq("TagName", tag)
            .eq("StudyID", study)
            .select();

        // throw error if error returned
        if (error) {
            throw error;
        }

        // cascade deletion - make null in MoodDataTable
        cascadeDeleteTag(study, tag);
        // successfully deleted
        return true;
        

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Cascades the deletion of a tag from a study. It updates the tag of an entry to null if the tag is being deleted.
 * @param {string} study - the study where the tag will be deleted from.
 * @param {string} tag - the tag to be deleted.
 * @returns - true if the tags are successfully updated to null, false if not.
 */
async function cascadeDeleteTag(study, tag) {
    try {
        // update deleted tag to null
        let { error } = await supabase
            .from("MoodDataTable")
            .update({ Tag: null })
            .eq("Tag", tag)
            .eq("StudyID", study);

        // throw error if error returned
        if (error) {
            throw error;
        }

        return true;

    } catch (e) {
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}

/**
 * Shows a list of all the tags available for a given study.
 * @param {string} study - the study for which the tag list will be rendered.
 * @returns - a HTML list of tags for the study, if no tags are available this in indicated to the user.
 */
export async function renderTags(study) {
    try {
        let { data , error } = await supabase
            .from("TagTable")
            .select("TagName")
            .eq("StudyID", study);

        if (error) {
            throw error;
        }

        if (data && data.length > 0) {
            return data.map((row, index) => (
                <li key={row.TagName}>{row.TagName}</li>
            ));
        } else {
            return <li key="no-tags">"No Tags Available"</li>;
        }
    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}


/**
 * Changes the password of a user.
 * @param {number} admin - the admin ID of the password to be changed.
 * @param {string} newPass - the new password which will be entered into the database.
 * @returns - true if the password is updated successfully, false if not.
 */
export async function changePassword(admin, newPass) {
    // change the password
    try {
        // update new password in database
        let { error } = await supabase
            .from("AdminTable")
            .update({ AdminPassword: newPass })
            .eq("AdminID", admin);

        // throw error if error returned
        if (error) {
            alert("Password could not be updated.");
            throw error;
        }
        
        // update user with success message
        alert("Password for AdminID '" + admin + "' updated successfully.");
        return true;


    } catch (e) {
        alert("Password could not be updated.");
        console.error("Error: Exception: " + e.message, e);
        return false;
    }
}