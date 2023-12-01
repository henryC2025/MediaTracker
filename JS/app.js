BLOB_ACCOUNT = "https://blobstoragehenry2001.blob.core.windows.net";

// URIs of REST ENDPOINT for MediaTracker
RAU = "https://prod-03.centralus.logic.azure.com/workflows/5b6f92b8394b4c85832f328f59edc19e/triggers/manual/paths/invoke/rest/v1/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VS5hEFa3LdCZGwI7kz7_tCLL8hZzQfPgXTK7ZMV8r2I";
GUI = "https://prod-07.centralus.logic.azure.com/workflows/643394927fc04c45879650de253f2001/triggers/manual/paths/invoke/rest/v1/user/id?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Pzr8ndLLy6krGu9a-si0pJkx1tJoy-teOs5ZtfK1X3c";
CNU = "https://prod-03.centralus.logic.azure.com/workflows/5b6f92b8394b4c85832f328f59edc19e/triggers/manual/paths/invoke/rest/v1/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VS5hEFa3LdCZGwI7kz7_tCLL8hZzQfPgXTK7ZMV8r2I";
CNM = "https://prod-00.centralus.logic.azure.com:443/workflows/fc47d272e0a74d5fb4cc13ef9dc6f3fe/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oOc1aOX8SVUP1lwkiwQSfAKAZv_1pRpjs-iO-MpJ8oU";
GUM = "https://prod-30.centralus.logic.azure.com/workflows/2a49afb03284461dbfa720e5b8e68ad8/triggers/manual/paths/invoke/rest/v1/user/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nbD3WVfTBNB95-Jn-BFWhE2vw-0poqcEeq61qPjVuJ8";
DIM = "https://prod-13.centralus.logic.azure.com/workflows/68858e21192d4139a808aea9ebd31ba9/triggers/manual/paths/invoke/rest/v1/user/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=17pSenr-JeysRZnJHiiiYgX6kr4HbvFuuJuwxOPbBow";
UUM = "https://prod-21.centralus.logic.azure.com/workflows/f76823ac9ade434bb22e894dbda3f5b5/triggers/manual/paths/invoke/rest/v1/user/media/{id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=inG_ONCrj1lJj9oy6KKZ-TgOK-6wQQWcMHVMP58AdyA";
GMD = "https://prod-05.centralus.logic.azure.com/workflows/7ae5f4bb21a444049c96f7aeecef2d6f/triggers/manual/paths/invoke/rest/v1/user/media/?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wKX6YBKLrKnxXaDa-pJRnpHlRbwMSjTcSD991djKIDo";

let loggedIn = false;
let loggedInUserID;
let loggedInUsername;

//Handlers for button clicks
$(document).ready(function() {

  // translateText();
  loadData();
  console.log(loggedIn)

  if(loggedIn === "true")
  {
    console.log("user is logged in")
    handleLoggedInUsers();
  }
  else
  {
    console.log("user is logged out")
  }

  $("#logoutButton").click(function(event){
    saveLoggedOutData();
  })
  
  // Guest button
  $("#guestButton").click(function(){
    saveGuestData()
  })

  // Register button on register from
  $("#submitRegister").click(function(event){
    event.preventDefault();
    // Submit registration
    submitRegistration();
  })

  // Login button on login form
  $("#submitLogin").click(function(event){
      event.preventDefault();
      // Submit login
      submitLogin();
  })

  // New container
  $('#indexContainer').on('click', '#submitNewMedia', function(event){
    event.preventDefault();
    submitNewMedia();
  });

  // Clear submit new media form
  $('#indexContainer').on('click', '#clearNewMediaForm', function(event){
    event.preventDefault();
    clearSubmitNewMedia();
  });

  $('#indexContainer').on('click', '#retMedia', function(event){
    event.preventDefault();
    getMedia();
  });

});

function editMedia(data) {

  var newFileName = window.prompt("Enter the new file name:", "");

  if(newFileName !== null)
  {
    var dataToUpdate = 
    {
      "id": data.id,
      "fileLocator" : data.fileLocator,
      "fileName" : newFileName,
      "filePath": data.filePath, 
      "fileType" : data.fileType,
      "userID" : data.userID,
      "userName" : data.userName
    };
  
    $.ajax({
      url: UUM,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(dataToUpdate),
      success: function (data) {
          console.log('PUT request successful', data);
          getMedia();
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.error('PUT request failed', textStatus, errorThrown);
      }})
  }
  else
  {
    console.log("exited")
  }

}

// create a new logic app for when 
function deleteMedia(mediaID) {
  // Log a message to the console
  console.log("Edit button clicked for mediaID: " + mediaID);
  var confirmDelete = window.confirm("Are you sure you want to delete this media item?");

  if (confirmDelete) 
  {
    DIM = DIM.replace('{id}', mediaID);
  
    $.ajax({
      type: "DELETE",
      url: DIM,
    }).done(function(msg){
      // On success, update the asset list
      getMedia();
      console.log("deleted media")
    });
  }
}

function validateRegistration(password)
{
   // Password validation
   // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const isPasswordValid = passwordRegex.test(password);

   return (isPasswordValid)
}

// Login TO-DO API to post data
function submitLogin()
{
  let loginEmail = $('#loginEmail').val().trim();
  let loginPassword = $('#loginPassword').val().trim();

  if(loginEmail != "" && loginPassword != "")
  {
    let requestData = {
      Email: loginEmail,
      Password: loginPassword
    };
  
    //Post the data to the endpoint
    $.ajax({
      url: GUI, 
      data: JSON.stringify(requestData),
      contentType: 'application/json',
      type: 'POST',
      success: function(data){

        console.log(data);
        console.log("userID" + data.Table1[0].UserID);
        console.log("userName" + data.Table1[0].UserName);
        loggedIn = true; 

        if(!(Object.keys(data).length === 0))
        {
          $('#loginFormDiv').empty();
          loggedInUserID = data.Table1[0].UserID;
          loggedInUsername = data.Table1[0].UserName;
          handleLoggedInUsers();
          saveLoggedInData(loggedInUserID);
        }
        else
        {
          window.alert("Looks like your login details are incorrect!")
        }

      },
      error: function(error) {
        // Handle login error
        console.error('Login failed:', error);
    }
  })
  }
  else
  {
    window.alert("Fields are empty!")
  }
}

function passwordMatch()
{
  let password = $('#registerPassword').val().trim();
  let confirmPassword = $('#registerConfirmPassword').val().trim();

  return (password === confirmPassword);
}

// Register TO-DO API to post data
function submitRegistration()
{
  let firstName = $('#registerFirstname').val().trim();
  let lastName = $('#registerLastname').val().trim();
  let userName = $('#registerUsername').val().trim();
  let email = $('#registerEmail').val().trim();
  let password = $('#registerPassword').val().trim();

  let requestData = {
    FirstName: firstName,
    LastName: lastName,
    UserName: userName,
    Email: email,
    Password: password
  };

  // Handle registration
  if(validateRegistration(password) && passwordMatch())
  {
    console.log("Reg is GOOD")
    $.ajax({
      url: CNU, 
      data: JSON.stringify(requestData),
      contentType: 'application/json',
      type: 'POST',
      success: function(data){
        console.log("data uploaded")
        handleRegistration();  
      },
      error: function(error) {
        // Handle login error
        window.alert("Looks like your username or email has already been taken!")
        console.error('Login failed:', error);
    }
  })
  }
  else if(!passwordMatch())
  {
    window.alert("Passwords do not match!")
  }
  else if(!validateRegistration(password))
  {
    window.alert("Password must be at least 8 characters long and \
    contain at least one uppercase letter, one lowercase letter, and one digit");
  }
  else
  {
    console.log("Something went wrong");
  }
}

function handleLoggedInUsers() {

  if (loggedIn) 
  {
    // Show the spinning animation
    $('#registerFormDiv').html('<div class="spinner-border" role="status"><span class="sr-only"></span></div>');

    // Add a delay to animation
    setTimeout(function() {
      $('#registerFormDiv').html('<a href="index.html" class="btn btn-secondary">Go to Media Share</a>');
    }, 1500); 

    // Show the spinning animation
    $('#loginFormDiv').html('<div class="spinner-border" role="status"><span class="sr-only"></span></div>');

    // Add a delay to animation
    setTimeout(function() {
      $('#loginFormDiv').html('<a href="index.html" class="btn btn-secondary">Go to Media Share</a>');
    }, 1500); 

    var loginStatusElement = document.getElementById('navBar');

    loginStatusElement.innerHTML += 
    `<ul class="navbar-nav" id="navBar">
    <li class="nav-item">
    <a class="nav-link" id="logoutButton" href="index.html">LOG-OUT</a>
    </li>
    </ul>`;
    
    // Spinning animation for loading
    $('#indexContainer').html('<div class="spinner-border" role="status"><span class="sr-only"></span></div>');

    // Simulate an asynchronous operation with a setTimeout
    setTimeout(function() {
      // Your code to be executed after 5 seconds (or any other duration)
      // Replace the following lines with your actual code

      var items = [];

      items.push(`
      <div class="row justify-content-center align-items-center" id="usernameDisplay">USER - ${loggedInUsername} </div>
      <div class="row align-items-start">
      <div class="col-2"  ></div>
      <div class="col-8" style="text-align: left;border-bottom:1px solid #dee2e6;">
      <p id="addMedia">Add Media</p>

      <form style="font-size: 10pt;" id="newAssetForm">
        <div class="mb-3">
        <label for="FileName" class="form-label">Name media file</label>
        <input type="text" class="form-control" id="fileName" required>
        </div>

        <div class="mb-3">
        <label for="FileType" class="form-label">Choose media type</label>
        <select class="form-select" id="fileType">
          <option value="jpg">JPG</option>
          <option value="png">PNG</option>
          <option value="mp3">MP3</option>
          <option value="mp4">MP4</option>
        </select>
        </div>

        <div class="mb-3">
          <label for="UpFile" class="form-label">Upload media file</label>
          <input type="file" class="form-control" id="upFile" required>
        </div>
      
        <div class="mb-3 d-flex justify-content-between">
          <button type="submit" id="submitNewMedia" class="btn btn-primary">Submit</button>
          <button type="button" id="clearNewMediaForm" class="btn btn-primary">Clear</button>
        </div>
    
      </form>
      </div>

      <div class="col-2"  ></div>
      </div>`)

      items.push('<div class="row align-items-start pt-3">');
      items.push('<div class="col-2"></div>');
      items.push('<div class="col-8" style="text-align: center;">');
      items.push('<div style="padding:5px;">');
      items.push('<button id="retMedia" type="button" class="btn btn-primary">View Media</button>');
      items.push('</div>');
      items.push('<div id="MediaList"></div></div>');
      items.push('<div class="col-2"></div></div>');

      $('#indexContainer').empty();

      $("<div/>", {
        "class": "loggedInUpload",
        html: items.join("")
      }).appendTo("#indexContainer");

      // End of your code

    }, 2000);
  }
}

// add index login and register pages
function handleLoggedOutUsers()
{
  $('#logoutButton').empty();
}

function handleRegistration()
{
  // Show the spinning animation
  $('#registerFormDiv').html('<div class="spinner-border" role="status"><span class="sr-only"></span></div>');

  // Add a delay to animation
  setTimeout(function() {
    $('#registerFormDiv').html('<a href="login.html" class="btn btn-secondary">Go to Login Page</a>');
  }, 1500); 
}

function loadData()
{
  loggedIn = localStorage.getItem('loggedIn');
  loggedInUserID = JSON.parse(localStorage.getItem('loggedInID'));
  loggedInUsername = localStorage.getItem('loggedInUserName');

  console.log(`Loading data loggedIn = ${loggedIn}  loggedInUserID = ${loggedInUserID}`)
}

function saveLoggedOutData()
{
  localStorage.setItem('loggedInID', 0);
  localStorage.setItem('loggedIn', false);
  localStorage.setItem('loggedInUserName', "None");
}

function saveLoggedInData(id)
{
  localStorage.setItem('loggedInID', id);
  localStorage.setItem('loggedIn', true);
  localStorage.setItem('loggedInUserName', loggedInUsername);
}

function saveGuestData()
{
  localStorage.setItem('loggedInID', 2);
  localStorage.setItem('loggedIn', true);
  localStorage.setItem('loggedInUserName', "Guest");
}

function submitNewMedia()
{
  let fileName = $('#fileName').val().trim();
  let fileType = $('#fileType').val();
  let uploadFile = $('#upFile')[0].files[0];

  console.log(uploadFile)
  
  if(uploadFile)
  {
    let uploadFileName = uploadFile.name;

    // Extract file extension
    var fileExtension = uploadFileName.split('.').pop().toLowerCase();
    console.log("File extension: " + fileExtension)
    console.log("Selected Media extension: " + fileType)
    
    // Check if the file extension matches the selected media type
    if (fileExtension === fileType && fileName != "") 
    {
      // LOGIC HERE ########################
      console.log("match")
      submitData = new FormData();

          //Get form variables and append them to the form data object
          submitData.append('fileName', fileName)
          submitData.append('fileType', fileType)
          submitData.append('userID', loggedInUserID)
          submitData.append('userName', loggedInUsername)
          submitData.append('uploadFile', uploadFile)  

          //Post the form data to the endpoint, note the need to set the content type header
          $.ajax({
            url: CNM, 
            data: submitData,
            cache: false,
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
              window.alert("Media has been uploaded successfully")
            },
            error: function(){
              console.log("Something went wrong")
            }
          })
    }
    else if(fileExtension != fileType)
    {
      console.log("file types don't match")
    }
    else if(fileName == "")
    {
      console.log("Please enter a name")
    }
    else if(fileExtension != 'JPG' || fileExtension != "PNG" || fileExtension != "MP3" || fileExtension != "MP4")
    {
      console.log("File type is not supported!")
    }
    else
    {
      console.log("some fields are empty")
    }
  }
  else
  {
    console.log("please select a file to upload")
  }
}

function clearSubmitNewMedia()
{
  $('#fileName').val("");
  $('#fileType').val("jpg");
  $('#upFile').val("");
}

function getMedia() {

  //Replace current HTML in that div with a loading message
  $('#MediaList').html('<div class="spinner-border" role="status"><span class="sr-only">&nbsp;</span>');

  GUM = GUM.replace('{id}', loggedInUserID);

  $.getJSON(GUM, function (data) {

      var items = [];

      $.each(data, function (key, val) 
      {
          let mediaHTML;

          if (val["fileType"] == 'jpg' || val["fileType"] == 'png') {
              mediaHTML = "img";
          } else if (val["fileType"] == "mp3") {
              mediaHTML = "audio controls";
          } else if (val["fileType"] == "mp4") {
              mediaHTML = "video controls";
          }

          items.push("<hr/>");
          items.push("File name - " + val["fileName"]);
          items.push('<br/>')
          items.push("Uploaded by - " + val["userName"]);
          items.push('<br/>')
          items.push(`<${mediaHTML} src='${BLOB_ACCOUNT}${val["filePath"]}' ${mediaHTML == 'video' ? 'type="video/mp4"' : ""} height='300' width='400'/> </${mediaHTML}>`);
          items.push('<br/>')
          items.push('<button type="button" class="btn btn-primary mt-3" id="editMedia" onclick="editMediaID(\'' + val["id"] + '\')">Edit</button>&nbsp;');
          items.push('<button type="button" class="btn btn-danger mt-3" onclick="deleteMedia(\'' + val["id"] + '\')">Delete</button>');
      });

      // Clear the MediaList div
      $('#MediaList').empty();

      // Append the contents of the items array to the MediaList Div
      $("<ul/>", {
          "class": "my-new-list",
          html: items.join("")
      }).appendTo("#MediaList");
  });
}

function editMediaID(id) {

  $.ajax({
    url: GMD,
    type: 'GET',
    dataType: 'json',
    success: function (data) 
    {
      const dataFromID = data.find(item => item.id === id);

      if (dataFromID) 
      {
        editMedia(dataFromID);
      } 
      else 
      {
        console.log("Cannot find data for ID");
      }
    },
    error: function (error) 
    {
      console.error('Error:', error);
    }
  });
}


// const subscriptionKey = 'bea4b809855b40869b8d52164f3e70e1';
// const region = 'centralus';
// const translateEndpoint = `https://${region}.api.cognitive.microsofttranslator.com/translate?api-version=3.0`;

// function translateText(text, targetLanguage) {
//   return new Promise((resolve, reject) => {
//     $.ajax({
//       url: translateEndpoint,
//       headers: {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key': subscriptionKey,
//       },
//       method: 'POST',
//       data: JSON.stringify([{ 'Text': text }]),
//       success: function (data) {
//         const translatedText = data[0].translations[0].text;
//         resolve(translatedText);
//       },
//       error: function (error) {
//         console.error('Translation Error:', error);
//         reject(error);
//       },
//     });
//   });
// }