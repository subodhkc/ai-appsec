/**
 * COMPLETE_GOLDEN_CORPUS — TypeScript component.
 * Clean file with no security concerns (negative control).
 */

interface User {
  id: string;
  name: string;
}

function getUser(id: string): User {
  return { id, name: "User " + id };
}

export { getUser, User };
