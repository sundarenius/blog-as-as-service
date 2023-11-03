
const maleNames = [
  "Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Mason", "Michael",
  "Alexander", "Henry", "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David", "Joseph", "Carter",
  "Owen", "Wyatt", "John", "Dylan", "Luke", "Gabriel", "Daniel", "Isaac", "Anthony", "Grayson",
  "Jack", "Julian", "Levi", "Christopher", "Joshua", "Andrew", "Lincoln", "Mateo", "Ryan", "Jaxon",
  "Nathan", "Aaron", "Isaiah", "Thomas", "Charles", "Caleb", "Hunter", "Eli", "Connor", "Jeremiah",
  "Nicholas", "Ezra", "Henry", "Jameson", "Julian", "Jonathan", "Evan", "Leo", "Adrian", "Gabriel",
  "Brandon", "Tyler", "Parker", "Jordan", "Zachary", "Colton", "Charlie", "Roman", "Hudson", "Maxwell",
  "Adam", "Austin", "Alex", "Tristan", "Joseph", "Bentley", "Ian", "Xavier", "Jose", "Landon",
  "Asher", "Bryson", "Jace", "Miles", "Steven", "Axel", "Santiago", "Dominic", "Jason", "Josiah",
  "Maddox", "Camden", "Chase", "Kingston", "Easton", "Kevin", "Ryder", "Jesus", "Silas", "Isaiah"
];
const femaleNames = [
  "Olivia", "Emma", "Ava", "Charlotte", "Sophia", "Amelia", "Isabella", "Mia", "Luna", "Harper",
  "Evelyn", "Abigail", "Emily", "Elizabeth", "Mila", "Ella", "Avery", "Sofia", "Camila", "Aria",
  "Scarlett", "Victoria", "Madison", "Lily", "Chloe", "Grace", "Aubrey", "Zoey", "Hannah", "Layla",
  "Riley", "Zoe", "Nora", "Lila", "Eleanor", "Hazel", "Violet", "Lily", "Lucy", "Stella", "Aurora",
  "Claire", "Sophie", "Bella", "Leah", "Zara", "Ellie", "Savannah", "Emilia", "Nova", "Penelope",
  "Madeline", "Alice", "Isla", "Rose", "Alexa", "Lucia", "Aaliyah", "Kinsley", "Maeve", "Elliana",
  "Skylar", "Hailey", "Autumn", "Paisley", "Alyssa", "Natalie", "Brooklyn", "Brielle", "Liliana", "Ariana",
  "Maya", "Serenity", "Scarlet", "Samantha", "Daisy", "Elena", "Vivian", "Willow", "Eva", "Quinn",
  "Ivy", "Delilah", "Sadie", "Julia", "Emery", "Katherine", "Brianna", "Alexandra", "Sophia", "Rebecca",
  "Callie", "Lola", "Zelda", "Adeline", "Vivienne", "Gabriella", "Clara", "Rylee", "Annabelle", "Holly"
];

const surnames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
  "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
  "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
  "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
  "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
  "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
  "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez",
  "Powell", "Jenkins", "Perry", "Russell", "Sullivan", "Bell", "Coleman", "Butler", "Henderson", "Barnes",
  "Gonzales", "Fisher", "Vasquez", "Simmons", "Romero", "Jordan", "Patterson", "Alexander", "Hamilton", "Graham",
  "Reynolds", "Griffin", "Wallace", "Moreno", "West", "Cole", "Hayes", "Bryant", "Herrera", "Gibson",
  "Ellis", "Tran", "Medina", "Aguilar", "Stevens", "Murray", "Ford", "Castro", "Marshall", "Owens",
  "Harrison", "Fernandez", "Washington", "Kennedy", "Wells", "Alvarez", "Woods", "Mendoza", "Castillo", "Olson",
  "Webb", "Washington", "Santos", "Estrada", "Porter", "Cohen", "Bishop", "Choi", "Carr", "Freeman",
  "Love", "Bryant", "Murray", "Davidson", "Gardner", "Stone", "Carlson", "Warren", "Williamson", "Hansen",
  "Sanders", "Fowler", "Perez", "Kim", "Sims", "Carrillo", "Vargas", "Morrow", "Rios", "Allen",
  "Wagner", "Willis", "Stevens", "Beck", "Daniels", "Owens", "Henry", "Holland", "Lane", "Carpenter",
  "Fields", "Luna", "Harper", "Austin", "Garcia", "Reeves", "Soto", "Wade", "Fisher", "Munoz"
];

export function generateRandomFullMaleName() {
  const randomFirstName = maleNames[Math.floor(Math.random() * maleNames.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return randomFirstName + " " + randomSurname;
}

export function generateRandomFullFemaleName() {
  const randomFirstName = femaleNames[Math.floor(Math.random() * femaleNames.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return randomFirstName + " " + randomSurname;
}
