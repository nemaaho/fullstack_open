
const Header = ({ course }) => <h3>{course}</h3>

const Total = ({ parts }) => {
    const sum = parts.reduce((total, part) => total + part.exercises, 0);
    return (
    <b>total of {sum} exercises</b>
    )
 }
 
 const Part = ({ part }) => 
   <p>
     {part.name} {part.exercises}
   </p>
 
 const Content = ({ parts }) => 
   <>
    {parts.map(part => (
       <Part key={part.id} part={part} />
     ))}
   </>
 
 const Course = ({ course }) => (
   <>
     <Header course={course.name} />
     <Content parts={course.parts} />
     <Total parts={course.parts} />
   </>
 )

 export default Course