export const formatDate = (date) => {
  // Get the month, day, and year
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date as "MM dd, yyyy"
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getInitials(fullName) {
  // DEBUG - See what's being passed
  console.log("getInitials called with:", fullName, "Type:", typeof fullName);
  
  // Return placeholder for truly undefined/null values
  if (fullName === undefined || fullName === null) {
    console.log("Returning ?? - undefined/null");
    return "??";
  }

  // Convert to string and trim whitespace
  const nameStr = String(fullName).trim();
  
  console.log("After String conversion:", nameStr);
  
  // Return placeholder for empty or invalid strings
  if (nameStr === "" || nameStr === "undefined" || nameStr === "null") {
    console.log("Returning ?? - empty/invalid");
    return "??";
  }

  // Split by space and get first letter of each name
  const names = nameStr.split(" ").filter(n => n.length > 0);
  
  console.log("Names array:", names);
  
  // Get initials from first two names
  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
  
  const result = initials.join("") || "??";
  console.log("Final result:", result);
  
  return result;
}

// ✅ UPDATED: Professional Teal Theme Colors
export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-amber-600",
  low: "text-primary-600",
};

export const TASK_TYPE = {
  todo: "bg-primary-600",           // Teal/Cyan for To Do
  "in progress": "bg-amber-600",    // Amber for In Progress
  completed: "bg-secondary-600",    // Teal/Green for Completed
};

export const BGS = [
  "bg-primary-600",      // Teal/Cyan
  "bg-secondary-600",    // Teal/Green
  "bg-amber-600",        // Amber
  "bg-pink-600",         // Pink
  "bg-purple-600",       // Purple
  "bg-indigo-600",       // Indigo
];
