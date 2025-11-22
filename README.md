# 🎓 Система управління навчальним процесом університету

Проект демонструє використання **TypeScript Enum** для створення типобезпечної системи управління студентами, курсами та оцінками в університеті.

## 📋 Опис проекту

Система дозволяє:
- Зараховувати студентів в університет
- Реєструвати студентів на курси
- Виставляти оцінки
- Змінювати статуси студентів
- Отримувати статистику по факультетам
- Знаходити відмінників

## 🎯 Використані Enum

### StudentStatus
Статуси студента в університеті:
- `Active` - активний студент
- `Academic_Leave` - академічна відпустка
- `Graduated` - випускник
- `Expelled` - відрахований

### CourseType
Типи курсів:
- `Mandatory` - обов'язковий
- `Optional` - за вибором
- `Special` - спеціальний

### Semester
Семестри навчання:
- `First` - перший семестр
- `Second` - другий семестр

### Grade
Оцінки студентів:
- `Excellent = 5` - відмінно
- `Good = 4` - добре
- `Satisfactory = 3` - задовільно
- `Unsatisfactory = 2` - незадовільно

### Faculty
Факультети університету:
- `Computer_Science` - комп'ютерні науки
- `Economics` - економіка
- `Law` - право
- `Engineering` - інженерія

## 🏗️ Архітектура

### Інтерфейси

**Student** - дані студента:
```typescript
interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number;
  status: StudentStatus;
  enrollmentDate: Date;
  groupNumber: string;
}
```

**Course** - дані курсу:
```typescript
interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number;
  semester: Semester;
  faculty: Faculty;
  maxStudents: number;
}
```

**StudentGrade** - оцінка студента:
```typescript
interface StudentGrade {
  studentId: number;
  courseId: number;
  grade: Grade;
  date: Date;
  semester: Semester;
}
```

### Клас UniversityManagementSystem

#### Основні методи:

**enrollStudent(student)** - зарахування нового студента
- Валідація даних студента
- Присвоєння унікального ID
- Перевірка курсу навчання та номера групи

**registerForCourse(studentId, courseId)** - реєстрація на курс
- Перевірка статусу студента (тільки Active)
- Перевірка відповідності факультету
- Перевірка кількості місць на курсі
- Перевірка чи студент вже зареєстрований

**setGrade(studentId, courseId, grade)** - виставлення оцінки
- Перевірка реєстрації студента на курс
- Можливість оновлення існуючої оцінки
- Логування виставлення/оновлення оцінки

**updateStudentStatus(studentId, newStatus)** - зміна статусу
- Валідація переходів між статусами
- Заборона зміни статусу випускника
- Заборона повернення відрахованого студента
- Перевірка курсу для статусу "Graduated"

**getStudentsByFaculty(faculty)** - список студентів факультету

**getStudentGrades(studentId)** - отримання всіх оцінок студента

**getAvailableCourses(faculty, semester)** - доступні курси

**calculateAverageGrade(studentId)** - середній бал студента

**getHonorStudents(faculty)** - відмінники факультету
- Студенти з усіма оцінками "5"

**getFacultyStatistics(faculty)** - статистика факультету
- Кількість студентів
- Кількість відмінників
- Розподіл за статусами

**printStudentInfo(studentId)** - детальна інформація про студента

## 🚀 Встановлення та запуск

### 1. Клонування репозиторію
```bash
git clone git@github.com:Sentore847/university-management-ts.git
cd university-management
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Варіанти запуску

#### Запуск в режимі розробки (швидкий)
```bash
npm run dev
```

#### Компіляція та запуск
```bash
npm run build
npm start
```

#### Компіляція з відслідковуванням змін
```bash
npm run watch
```

#### Очищення скомпільованих файлів
```bash
npm run clean
```

## 💻 Приклад використання
```typescript
// Створення системи
const university = new UniversityManagementSystem();

// Додавання курсу
university.addCourse({
  id: 1,
  name: "Програмування на TypeScript",
  type: CourseType.Mandatory,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 30
});

// Зарахування студента
const student = university.enrollStudent({
  fullName: "Іваненко Іван Іванович",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date(2023, 8, 1),
  groupNumber: "КН-21"
});

// Реєстрація на курс
university.registerForCourse(student.id, 1);

// Виставлення оцінки
university.setGrade(student.id, 1, Grade.Excellent);

// Отримання середнього балу
const average = university.calculateAverageGrade(student.id);
console.log(`Середній бал: ${average}`);
```

## ✅ Реалізовані вимоги

- ✅ Всі Enum створені та використовуються
- ✅ Всі інтерфейси реалізовані
- ✅ Клас UniversityManagementSystem з усіма методами
- ✅ Валідація реєстрації на курс (кількість студентів, факультет)
- ✅ Валідація зміни статусу студента
- ✅ Перевірка можливості виставлення оцінки
- ✅ Метод отримання відмінників по факультету
- ✅ Повна типізація всіх методів
- ✅ Детальні коментарі в коді
- ✅ Вся логіка в одному файлі

## 🔒 Валідація та безпека

Система включає перевірки:
- Існування студента/курсу перед операцією
- Статус студента для реєстрації на курс
- Відповідність факультету студента і курсу
- Ліміт студентів на курсі
- Реєстрація на курс перед виставленням оцінки
- Логічність переходів між статусами
- Коректність вхідних даних (курс навчання, кредити тощо)

## 📊 Демонстрація

При запуску програми виконується повна демонстрація:
1. Додавання курсів
2. Зарахування студентів
3. Реєстрація на курси
4. Виставлення оцінок
5. Зміна статусів
6. Виведення списків та статистики
7. Демонстрація обробки помилок

## 🔧 Технології

- **TypeScript 5.3** - мова програмування
- **Node.js** - середовище виконання
- **tsx** - виконання TypeScript без компіляції

## 📝 Структура коду

Файл `university-management.ts` містить:
1. **Enum-и** - всі перелічення
2. **Інтерфейси** - типи даних
3. **Клас** - логіка системи
4. **Демонстрація** - приклади використання

## 🎓 Навчальні цілі

1. ✅ Робота з Enum в TypeScript
2. ✅ Використання числових та строкових Enum
3. ✅ Типізація з Enum
4. ✅ Валідація бізнес-логіки
5. ✅ Робота з інтерфейсами та класами

---

**Примітка:** Цей проект створено в навчальних цілях для демонстрації роботи з Enum в TypeScript.
