/**
 * Статус студента в університеті
 */
enum StudentStatus {
  Active = "Active",
  Academic_Leave = "Academic_Leave",
  Graduated = "Graduated",
  Expelled = "Expelled"
}

/**
 * Тип навчального курсу
 */
enum CourseType {
  Mandatory = "Mandatory",
  Optional = "Optional",
  Special = "Special"
}

/**
 * Семестр навчання
 */
enum Semester {
  First = "First",
  Second = "Second"
}

/**
 * Оцінки студентів
 */
enum Grade {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2
}

/**
 * Факультети університету
 */
enum Faculty {
  Computer_Science = "Computer_Science",
  Economics = "Economics",
  Law = "Law",
  Engineering = "Engineering"
}

// ==================== INTERFACES ====================

/**
 * Інтерфейс студента
 */
interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}

/**
 * Інтерфейс курсу
 */
interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}

/**
 * Інтерфейс оцінки студента за курс
 */
interface StudentGrade {
  studentId: number;
  courseId: number;
  grade: Grade;
  date: Date;
  semester: Semester;
}

/**
 * Інтерфейс реєстрації студента на курс
 */
interface CourseRegistration {
  studentId: number;
  courseId: number;
  registrationDate: Date;
}

// ==================== CLASS ====================

/**
 * Головний клас системи управління університетом
 */
class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private grades: StudentGrade[] = [];
  private courseRegistrations: CourseRegistration[] = [];
  private studentIdCounter: number = 1;

  /**
   * Зареєструвати нового студента в університеті
   * @param student - Дані студента без ID
   * @returns Створений студент з ID
   */
  enrollStudent(student: Omit<Student, "id">): Student {
    // Валідація даних студента
    if (!student.fullName || student.fullName.trim().length === 0) {
      throw new Error("Ім'я студента не може бути порожнім");
    }

    if (student.year < 1 || student.year > 6) {
      throw new Error("Курс навчання має бути від 1 до 6");
    }

    if (!student.groupNumber || student.groupNumber.trim().length === 0) {
      throw new Error("Номер групи не може бути порожнім");
    }

    // Створення нового студента з унікальним ID
    const newStudent: Student = {
      id: this.studentIdCounter++,
      ...student
    };

    this.students.push(newStudent);
    console.log(`✓ Студента ${newStudent.fullName} успішно зараховано (ID: ${newStudent.id})`);
    
    return newStudent;
  }

  /**
   * Зареєструвати студента на курс
   * @param studentId - ID студента
   * @param courseId - ID курсу
   */
  registerForCourse(studentId: number, courseId: number): void {
    // Перевірка існування студента
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    // Перевірка статусу студента
    if (student.status !== StudentStatus.Active) {
      throw new Error(`Студент має статус ${student.status}. Реєстрація на курси доступна тільки для активних студентів`);
    }

    // Перевірка існування курсу
    const course = this.courses.find(c => c.id === courseId);
    if (!course) {
      throw new Error(`Курс з ID ${courseId} не знайдено`);
    }

    // Перевірка відповідності факультету
    if (student.faculty !== course.faculty) {
      throw new Error(`Студент факультету ${student.faculty} не може зареєструватися на курс факультету ${course.faculty}`);
    }

    // Перевірка чи студент вже зареєстрований на цей курс
    const alreadyRegistered = this.courseRegistrations.some(
      reg => reg.studentId === studentId && reg.courseId === courseId
    );
    if (alreadyRegistered) {
      throw new Error(`Студент вже зареєстрований на цей курс`);
    }

    // Перевірка кількості студентів на курсі
    const currentStudentCount = this.courseRegistrations.filter(
      reg => reg.courseId === courseId
    ).length;

    if (currentStudentCount >= course.maxStudents) {
      throw new Error(`Курс "${course.name}" переповнено. Максимальна кількість студентів: ${course.maxStudents}`);
    }

    // Реєстрація студента на курс
    this.courseRegistrations.push({
      studentId,
      courseId,
      registrationDate: new Date()
    });

    console.log(`✓ Студента ${student.fullName} зареєстровано на курс "${course.name}"`);
  }

  /**
   * Виставити оцінку студенту за курс
   * @param studentId - ID студента
   * @param courseId - ID курсу
   * @param grade - Оцінка
   */
  setGrade(studentId: number, courseId: number, grade: Grade): void {
    // Перевірка існування студента
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    // Перевірка існування курсу
    const course = this.courses.find(c => c.id === courseId);
    if (!course) {
      throw new Error(`Курс з ID ${courseId} не знайдено`);
    }

    // Перевірка реєстрації студента на курс
    const isRegistered = this.courseRegistrations.some(
      reg => reg.studentId === studentId && reg.courseId === courseId
    );
    if (!isRegistered) {
      throw new Error(`Студент не зареєстрований на курс "${course.name}". Спочатку зареєструйте студента на курс`);
    }

    // Перевірка чи вже є оцінка за цей курс
    const existingGrade = this.grades.find(
      g => g.studentId === studentId && g.courseId === courseId
    );

    if (existingGrade) {
      // Оновлення існуючої оцінки
      existingGrade.grade = grade;
      existingGrade.date = new Date();
      console.log(`✓ Оцінку студента ${student.fullName} за курс "${course.name}" оновлено на ${grade}`);
    } else {
      // Додавання нової оцінки
      this.grades.push({
        studentId,
        courseId,
        grade,
        date: new Date(),
        semester: course.semester
      });
      console.log(`✓ Студенту ${student.fullName} виставлено оцінку ${grade} за курс "${course.name}"`);
    }
  }

  /**
   * Оновити статус студента
   * @param studentId - ID студента
   * @param newStatus - Новий статус
   */
  updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    const oldStatus = student.status;

    // Валідація переходів між статусами
    if (oldStatus === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
      throw new Error("Неможливо змінити статус випускника");
    }

    if (oldStatus === StudentStatus.Expelled && newStatus === StudentStatus.Active) {
      throw new Error("Неможливо повернути відрахованого студента до активних");
    }

    if (newStatus === StudentStatus.Graduated && student.year < 4) {
      throw new Error("Студент може отримати статус 'Graduated' тільки після 4-го курсу");
    }

    student.status = newStatus;
    console.log(`✓ Статус студента ${student.fullName} змінено з ${oldStatus} на ${newStatus}`);
  }

  /**
   * Отримати список студентів за факультетом
   * @param faculty - Факультет
   * @returns Масив студентів
   */
  getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter(student => student.faculty === faculty);
  }

  /**
   * Отримати всі оцінки студента
   * @param studentId - ID студента
   * @returns Масив оцінок студента
   */
  getStudentGrades(studentId: number): StudentGrade[] {
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    return this.grades.filter(grade => grade.studentId === studentId);
  }

  /**
   * Отримати доступні курси для факультету та семестру
   * @param faculty - Факультет
   * @param semester - Семестр
   * @returns Масив доступних курсів
   */
  getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
    return this.courses.filter(
      course => course.faculty === faculty && course.semester === semester
    );
  }

  /**
   * Розрахувати середній бал студента
   * @param studentId - ID студента
   * @returns Середній бал
   */
  calculateAverageGrade(studentId: number): number {
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    const studentGrades = this.grades.filter(g => g.studentId === studentId);
    
    if (studentGrades.length === 0) {
      return 0;
    }

    const sum = studentGrades.reduce((acc, g) => acc + g.grade, 0);
    return Math.round((sum / studentGrades.length) * 100) / 100;
  }

  /**
   * Отримати список відмінників по факультету
   * @param faculty - Факультет
   * @returns Масив студентів-відмінників
   */
  getHonorStudents(faculty: Faculty): Student[] {
    const facultyStudents = this.getStudentsByFaculty(faculty);
    
    return facultyStudents.filter(student => {
      const studentGrades = this.grades.filter(g => g.studentId === student.id);
      
      // Студент вважається відмінником, якщо всі оцінки = 5
      if (studentGrades.length === 0) {
        return false;
      }

      return studentGrades.every(g => g.grade === Grade.Excellent);
    });
  }

  /**
   * Додати курс до системи
   * @param course - Дані курсу
   */
  addCourse(course: Course): void {
    // Перевірка унікальності ID курсу
    if (this.courses.some(c => c.id === course.id)) {
      throw new Error(`Курс з ID ${course.id} вже існує`);
    }

    if (course.credits <= 0) {
      throw new Error("Кількість кредитів має бути більше 0");
    }

    if (course.maxStudents <= 0) {
      throw new Error("Максимальна кількість студентів має бути більше 0");
    }

    this.courses.push(course);
    console.log(`✓ Курс "${course.name}" додано до системи`);
  }

  /**
   * Отримати статистику по факультету
   * @param faculty - Факультет
   */
  getFacultyStatistics(faculty: Faculty): void {
    const students = this.getStudentsByFaculty(faculty);
    const honorStudents = this.getHonorStudents(faculty);
    
    console.log(`\n📊 Статистика факультету ${faculty}:`);
    console.log(`   Всього студентів: ${students.length}`);
    console.log(`   Відмінників: ${honorStudents.length}`);
    
    const statusCounts = {
      [StudentStatus.Active]: 0,
      [StudentStatus.Academic_Leave]: 0,
      [StudentStatus.Graduated]: 0,
      [StudentStatus.Expelled]: 0
    };

    students.forEach(s => statusCounts[s.status]++);
    
    console.log(`   Активних: ${statusCounts[StudentStatus.Active]}`);
    console.log(`   Академічна відпустка: ${statusCounts[StudentStatus.Academic_Leave]}`);
    console.log(`   Випускників: ${statusCounts[StudentStatus.Graduated]}`);
    console.log(`   Відрахованих: ${statusCounts[StudentStatus.Expelled]}`);
  }

  /**
   * Вивести інформацію про студента
   * @param studentId - ID студента
   */
  printStudentInfo(studentId: number): void {
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено`);
    }

    const grades = this.getStudentGrades(studentId);
    const averageGrade = this.calculateAverageGrade(studentId);

    console.log(`\n👤 Інформація про студента:`);
    console.log(`   ID: ${student.id}`);
    console.log(`   ПІБ: ${student.fullName}`);
    console.log(`   Факультет: ${student.faculty}`);
    console.log(`   Курс: ${student.year}`);
    console.log(`   Група: ${student.groupNumber}`);
    console.log(`   Статус: ${student.status}`);
    console.log(`   Дата зарахування: ${student.enrollmentDate.toLocaleDateString()}`);
    console.log(`   Кількість оцінок: ${grades.length}`);
    console.log(`   Середній бал: ${averageGrade}`);
  }
}

// ==================== ДЕМОНСТРАЦІЯ РОБОТИ ====================

console.log('='.repeat(70));
console.log('🎓 СИСТЕМА УПРАВЛІННЯ НАВЧАЛЬНИМ ПРОЦЕСОМ УНІВЕРСИТЕТУ');
console.log('='.repeat(70));

// Створення системи
const university = new UniversityManagementSystem();

// Додавання курсів
console.log('\n📚 ДОДАВАННЯ КУРСІВ');
console.log('-'.repeat(70));

university.addCourse({
  id: 1,
  name: "Програмування на TypeScript",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
});

university.addCourse({
  id: 2,
  name: "Алгоритми та структури даних",
  type: CourseType.Mandatory,
  credits: 6,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
});

university.addCourse({
  id: 3,
  name: "Мікроекономіка",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Economics,
  maxStudents: 25
});

university.addCourse({
  id: 4,
  name: "Веб-розробка",
  type: CourseType.Optional,
  credits: 4,
  semester: Semester.Second,
  faculty: Faculty.Computer_Science,
  maxStudents: 20
});

// Зарахування студентів
console.log('\n👥 ЗАРАХУВАННЯ СТУДЕНТІВ');
console.log('-'.repeat(70));

const student1 = university.enrollStudent({
  fullName: "Іваненко Іван Іванович",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date(2023, 8, 1),
  groupNumber: "КН-21"
});

const student2 = university.enrollStudent({
  fullName: "Петренко Петро Петрович",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date(2023, 8, 1),
  groupNumber: "КН-21"
});

const student3 = university.enrollStudent({
  fullName: "Сидоренко Марія Олександрівна",
  faculty: Faculty.Economics,
  year: 1,
  status: StudentStatus.Active,
  enrollmentDate: new Date(2024, 8, 1),
  groupNumber: "ЕК-11"
});

// Реєстрація на курси
console.log('\n📝 РЕЄСТРАЦІЯ НА КУРСИ');
console.log('-'.repeat(70));

university.registerForCourse(student1.id, 1);
university.registerForCourse(student1.id, 2);
university.registerForCourse(student2.id, 1);
university.registerForCourse(student2.id, 2);
university.registerForCourse(student3.id, 3);

// Виставлення оцінок
console.log('\n📊 ВИСТАВЛЕННЯ ОЦІНОК');
console.log('-'.repeat(70));

university.setGrade(student1.id, 1, Grade.Excellent);
university.setGrade(student1.id, 2, Grade.Excellent);
university.setGrade(student2.id, 1, Grade.Good);
university.setGrade(student2.id, 2, Grade.Satisfactory);
university.setGrade(student3.id, 3, Grade.Excellent);

// Виведення інформації про студентів
university.printStudentInfo(student1.id);
university.printStudentInfo(student2.id);

// Зміна статусу
console.log('\n🔄 ЗМІНА СТАТУСУ СТУДЕНТА');
console.log('-'.repeat(70));
university.updateStudentStatus(student2.id, StudentStatus.Academic_Leave);

// Отримання списку студентів по факультету
console.log('\n📋 СТУДЕНТИ ФАКУЛЬТЕТУ COMPUTER SCIENCE');
console.log('-'.repeat(70));
const csStudents = university.getStudentsByFaculty(Faculty.Computer_Science);
csStudents.forEach(s => {
  console.log(`- ${s.fullName} (курс ${s.year}, група ${s.groupNumber}, статус: ${s.status})`);
});

// Отримання відмінників
console.log('\n🏆 ВІДМІННИКИ ФАКУЛЬТЕТУ COMPUTER SCIENCE');
console.log('-'.repeat(70));
const honorStudents = university.getHonorStudents(Faculty.Computer_Science);
if (honorStudents.length > 0) {
  honorStudents.forEach(s => {
    console.log(`- ${s.fullName}`);
  });
} else {
  console.log('Відмінників поки немає');
}

// Статистика факультету
university.getFacultyStatistics(Faculty.Computer_Science);
university.getFacultyStatistics(Faculty.Economics);

// Демонстрація помилок
console.log('\n⚠️  ДЕМОНСТРАЦІЯ ВАЛІДАЦІЇ');
console.log('-'.repeat(70));

try {
  // Спроба зареєструвати студента на курс іншого факультету
  university.registerForCourse(student1.id, 3);
} catch (error) {
  console.log(`✗ Помилка: ${(error as Error).message}`);
}

try {
  // Спроба виставити оцінку без реєстрації на курс
  university.setGrade(student3.id, 1, Grade.Good);
} catch (error) {
  console.log(`✗ Помилка: ${(error as Error).message}`);
}

try {
  // Спроба змінити статус випускника
  const graduatedStudent = university.enrollStudent({
    fullName: "Коваленко Ольга Петрівна",
    faculty: Faculty.Computer_Science,
    year: 4,
    status: StudentStatus.Graduated,
    enrollmentDate: new Date(2020, 8, 1),
    groupNumber: "КН-17"
  });
  university.updateStudentStatus(graduatedStudent.id, StudentStatus.Active);
} catch (error) {
  console.log(`✗ Помилка: ${(error as Error).message}`);
}

console.log('\n' + '='.repeat(70));
console.log('✅ ДЕМОНСТРАЦІЯ ЗАВЕРШЕНА');
console.log('='.repeat(70));