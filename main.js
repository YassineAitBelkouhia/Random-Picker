const isListEmpty = async () => {
  let response = await axios
    .get("http://localhost:3000/Students")
    .then((response) => {
      console.log(response.data.length);
      listBtn.style.display = response.data.length != 0 ? "block" : "none";
    });
};

isListEmpty();

const handleStart = () => {
  container.classList.remove("container-start");
  container.classList.add("container-form");
  startBtn.style.display = "none";
  form.style.display = "inline";
  headingText.style.display = "block";
};

const handleAdd = async () => {
  if (form.name.value && form.subject.value) {
    const nameWords = form.name.value.split(" ");
    const subjectWords = form.subject.value.split(" ");
    const capitalizedName = nameWords
      .map((nameWord) => {
        return nameWord[0].toUpperCase() + nameWord.substring(1);
      })
      .join(" ");
    const capitalizedSubject = subjectWords
      .map((subjectWord) => {
        return subjectWord[0].toUpperCase() + subjectWord.substring(1);
      })
      .join(" ");
    const student = {
      fullName: capitalizedName,
      subject: capitalizedSubject,
    };
    console.log(student);
    await axios.post("http://localhost:3000/Students", student);

    // data = data.data;
    // console.log(data);

    form.name.value = "";
    form.subject.value = "";
    listBtn.style.display = "block";
  } else {
    alert("Please Fill Out Both Fields");
  }
};

const handelList = async () => {
  let studentListItems = [];

  await axios.get("http://localhost:3000/Students").then((response) => {
    studentListItems = response.data;
    console.log(studentListItems);
  });

  let template = ` <tr>
   <th>Full Name</th>
   <th>Subject</th>
    </tr>`;
  studentListItems.forEach((student) => {
    template += `
  <tr>
    <td>${student.fullName}</td>
    <td>${student.subject}</td>
    
   
  </tr>
    `;
  });

  studentsTable.innerHTML = template;
  form.style.display = "none";
  headingText.innerHTML = "Students List";
  studentsTable.style.display = "block";
};

const isWeekend = (date) => {
  let d = new Date(date);
  if (d.getDay() == 6 || d.getDay() == 0) {
    return true;
  } else {
    return false;
  }
};

let today = new Date();

const handleRandom = async () => {
  let students = [];
  let counter = 0;
  // let index = null;
  let dates = [];
  let AssignedStudents = [];

  headingText.innerText = "Loading ...";
  form.style.display = "none";

  let response = await axios
    .get("http://localhost:3000/Students")
    .then((response) => {
      students = response.data;
      // console.log(students);
    });

  do {
    let d = new Date();
    d.setDate(today.getDate() + counter);
    if (!isWeekend(d)) {
      dates.push(d);
    }
    counter++;
  } while (dates.length != students.length);

  // console.log(dates);
  // console.log(students);

  let formatedDates = dates.map((date) => {
    let dateToArray = date.toString().split(" ");
    let formatedDate = dateToArray.slice(0, 3);
    return formatedDate.join(" ");
  });

  formatedDates.forEach(async (date) => {
    let randomIndex = null;

    do {
      randomIndex = Math.floor(Math.random() * students.length);
    } while (!students[randomIndex]);

    let assignedStudent = {
      fullName: students[randomIndex].fullName,
      subject: students[randomIndex].subject,
      dueDate: date,
    };

    AssignedStudents.push(assignedStudent);
    students[randomIndex] = null;
  });

  console.log(AssignedStudents);

  let template = `<tr>
  <th>Full Name</th>
  <th>Subject</th>
  <th>Due Date</th>
   </tr>`;

  AssignedStudents.forEach((assignedStudent) => {
    template += `
    <tr>
      <td>${assignedStudent.fullName}</td>
      <td>${assignedStudent.subject}</td>
      <td>${assignedStudent.dueDate}</td>
    </tr>
    `;
  });

  finalListContainer.innerHTML = template;
  finalListContainer.innerHTML += `
  <button onclick="handleDownload()" class="downloadBtn">DOWNLOAD</button>
  `;

  setTimeout(() => {
    headingText.innerText = "Final Order";
    finalListContainer.style.display = "block";
  }, 3000);
};

const handleDownload = () => {
  var table2excel = new Table2Excel();
  table2excel.export(document.getElementById("finalListContainer"));
};

const headingText = document.getElementById("headingText");
const form = document.getElementById("form");
const container = document.getElementById("container");
const startBtn = document.getElementById("startBtn");
const studentsTable = document.getElementById("studentsTable");
const finalListContainer = document.getElementById("finalListContainer");
const listBtn = document.getElementById("listBtn");

studentsTable.addEventListener("click", () => {
  studentsTable.style.display = "none";
  form.style.display = "block";
  headingText.innerHTML = "Add Students names and SUBJECTS !";
});
