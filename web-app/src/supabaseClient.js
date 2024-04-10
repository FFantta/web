import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const supabaseUrl = "https://uyjpltlosfpmsgjxnvmm.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5anBsdGxvc2ZwbXNnanhudm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMDMyMjEsImV4cCI6MjAyMzU3OTIyMX0.hWr6Bj4EtDrVnB9nWpc--GuPKpmVqGGZW9uMovyWrmo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export let selectedParticipant = null;

function setSelectedParticipant(num) {
    selectedParticipant = num;
}

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
                console.log("Login successful");
                return true;
            } else {
                // Password is incorrect
                console.log("Incorrect password");
                return false;
            }
        } else {
            // Admin ID not in database
            console.log("Admin ID not found");
            return false;
        }
    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return false;
    }

}

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
                console.log("This admin can create others");
                return true;
            } else {
                // Password is incorrect
                console.log("Role incorrect");
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

        console.log("Admin inserted successfully:", data);
        return data.AdminID;
    } catch (error) {
        console.error("Error inserting admin:", error.message);
        return false;
    }
}
export async function insertStudy(studyName) {
    try {
        let { data, error } = await supabase
            .from('StudyTable')
            .insert([{ StudyID: studyName }]);
        if (error) {
            throw error;
        }
        return true;
    } catch (error) {
        console.error("Error inserting Study:", error.message);
    }
}
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
        return [];
    }
}

export async function getStudyData(studyID){
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)

        if (error) {
            throw error;
        }
        if(data.length > 0){
            return data;
        }
        else {return null};

    }
    catch(e){
        console.error("Error: Exception: " + e.message, e);
        return null;
    }
}

export async function getParticipantData(studyID,pID){
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
        else {return null};

    }
    catch(e){
        console.error("Error: Exception: " + e.message, e);
        return null;
    }
}

export async function renderParticipantDatabase(studyID, pID) {
    try {
        let { data , error } = await supabase
            .from("MoodDataTable")
            .select("*")
            .eq("StudyID", studyID)
            .eq("ParticipantID", pID)
            .order("DataID", {ascending: true});;

        // throw error if error returned
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
                        return(
                            <tr>
                                <td>{row.DataID}</td>
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
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}

export async function renderDropdownStudies() {
    try {
        let { data , error } = await supabase
            .from("StudyTable")
            .select("StudyID");

        // throw error if error returned
        if (error) {
            throw error;
        }

        // render the studies
        if (data && data.length > 0) {
            return(
                data.map(row => {
                    return(
                        <option value={row.StudyID}>{row.StudyID}</option>
                    );
                })
            );
        }
        // error return
        else {
            return(
                <option value="error">No Studies Found</option>
            );   
        }

    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}

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

// check if the tag to be added is already in the database
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

// adding a tag to the database
export async function addTag(study, tag) {
    try {
        // add tag to database otherwise
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

// check if a dataID already has a certain tag
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
            console.log(data.Tag);
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

// check if dataID exists in studyID
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

// tag data in data 
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

// remove tag from data
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

// delete an existing tag
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

// cascade deleted tag - update entries with that tag to null
async function cascadeDeleteTag(study, tag) {
    try {
        // update deleted tag to null
        let { data, error } = await supabase
            .from("MoodDataTable")
            .update({ Tag: null })
            .eq("Tag", tag)
            .eq("StudyID", study);

        console.log(data);

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

export async function renderTags(study) {
    try {
        let { data , error } = await supabase
            .from("TagTable")
            .select("TagName")
            .eq("StudyID", study);

        // throw error if error returned
        if (error) {
            throw error;
        }

        // render the studies
        if (data && data.length > 0) {
            return(
                data.map(row => {
                    return(
                        <li>{row.TagName}</li>
                    );
                })
            );
        }
        // error return
        else {
            return(
                <text>"No Tags Available"</text>
            );   
        }

    } catch (e) {
        console.error("Supabase Error: Exception: " + e.message, e);
        return [];
    }
}
