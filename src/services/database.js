import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore } from './firebase';

const SESSION_STORAGE_KEY = '@library_hub_active_user';

// ========================================================
// 1. CLOUD FIRESTORE INITIALIZATION & AUTO-SEEDING
// ========================================================
export const initDatabase = async () => {
  try {
    // Check if Firestore 'books' collection has been seeded
    const booksCol = collection(firestore, 'books');
    const snapshot = await getDocs(booksCol);

    if (snapshot.empty) {
      console.log('Seeding Cloud Firestore with Milestone 02 initial data...');
      await seedFirestore();
    } else {
      // Ensure default users exist with password123
      await ensureDefaultUsersExist();
    }

    // Set default session if none exists
    const activeId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (!activeId) {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, 'u1');
    }
  } catch (error) {
    console.error('Error during Firestore initialization:', error);
  }
};

const ensureDefaultUsersExist = async () => {
  try {
    const u1Ref = doc(firestore, 'users', 'u1');
    const u1Snap = await getDoc(u1Ref);
    if (!u1Snap.exists()) {
      await setDoc(u1Ref, {
        id: 'u1',
        student_id: 'MU2024001',
        name: 'Arjun Mehta',
        email: 'arjun@meridian.edu',
        department: 'Computer Science',
        password: 'password123',
        avatar: 'AM',
        books_read: 47,
        days_active: 186,
        fines_paid: 0,
        library_card_id: 'MU-LIB-2024-001',
        card_status: 'Active',
        card_valid_until: 'Dec 2026',
      });
    }

    const u2Ref = doc(firestore, 'users', 'u2');
    const u2Snap = await getDoc(u2Ref);
    if (!u2Snap.exists()) {
      await setDoc(u2Ref, {
        id: 'u2',
        student_id: 'IT23336872',
        name: 'Charitha Dunusinhe',
        email: 'it23336872@my.sliit.lk',
        department: 'Information Technology',
        password: 'password123',
        avatar: 'CD',
        books_read: 15,
        days_active: 45,
        fines_paid: 0,
        library_card_id: 'SLIIT-LIB-IT23336872',
        card_status: 'Active',
        card_valid_until: 'Dec 2026',
      });
    }
  } catch (e) {
    console.warn('Could not ensure default users in Firestore:', e);
  }
};

export const seedFirestore = async () => {
  const batch = writeBatch(firestore);

  // 1. Seed Students (Users)
  const defaultUsers = [
    {
      id: 'u1',
      student_id: 'MU2024001',
      name: 'Arjun Mehta',
      email: 'arjun@meridian.edu',
      department: 'Computer Science',
      password: 'password123',
      avatar: 'AM',
      books_read: 47,
      days_active: 186,
      fines_paid: 0,
      library_card_id: 'MU-LIB-2024-001',
      card_status: 'Active',
      card_valid_until: 'Dec 2026',
    },
    {
      id: 'u2',
      student_id: 'IT23336872',
      name: 'Charitha Dunusinhe',
      email: 'it23336872@my.sliit.lk',
      department: 'Information Technology',
      password: 'password123',
      avatar: 'CD',
      books_read: 15,
      days_active: 45,
      fines_paid: 0,
      library_card_id: 'SLIIT-LIB-IT23336872',
      card_status: 'Active',
      card_valid_until: 'Dec 2026',
    },
  ];

  for (const u of defaultUsers) {
    batch.set(doc(firestore, 'users', u.id), u);
  }

  // 2. Seed Books (Milestone 02 Catalog)
  const books = [
    {
      id: 'b1',
      title: 'Introduction to Algorithms',
      authors: 'Cormen, Leiserson, Rivest & Stein',
      category: 'CS',
      rating: 4.8,
      published_year: '2022',
      language: 'English',
      floor_location: '3rd Floor',
      shelf_location: 'Desk 12 · Block B',
      copies_available: 3,
      total_copies: 5,
      description: 'A comprehensive textbook covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers.',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      status: 'Available',
    },
    {
      id: 'b2',
      title: 'The Psychology of Learning',
      authors: 'Dr. Sarah Kimani',
      category: 'Psychology',
      rating: 4.5,
      published_year: '2021',
      language: 'English',
      floor_location: '2nd Floor',
      shelf_location: 'Shelf P-04',
      copies_available: 2,
      total_copies: 4,
      description: 'Explores human cognition, memory consolidation mechanisms, and modern pedagogical learning frameworks.',
      cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=400',
      status: 'Available',
    },
    {
      id: 'b3',
      title: 'Cell Biology Essentials',
      authors: 'Bruce Alberts & Karen Hopkin',
      category: 'Biology',
      rating: 4.7,
      published_year: '2023',
      language: 'English',
      floor_location: '1st Floor',
      shelf_location: 'Shelf B-11',
      copies_available: 4,
      total_copies: 6,
      description: 'Provides a readily understandable introduction to the central concepts of cell biology and molecular processes.',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      status: 'Available',
    },
    {
      id: 'b4',
      title: 'Principles of Macroeconomics',
      authors: 'N. Gregory Mankiw',
      category: 'Economics',
      rating: 4.6,
      published_year: '2020',
      language: 'English',
      floor_location: '2nd Floor',
      shelf_location: 'Shelf E-08',
      copies_available: 1,
      total_copies: 3,
      description: 'The most popular introductory book in economics, providing clear explanations of inflation, monetary policies, and global markets.',
      cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      status: 'Available',
    },
    {
      id: 'b5',
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      authors: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      category: 'CS',
      rating: 4.9,
      published_year: '2019',
      language: 'English',
      floor_location: '3rd Floor',
      shelf_location: 'Shelf CS-02',
      copies_available: 2,
      total_copies: 4,
      description: 'Captures a wealth of experience about the design of object-oriented software and practical design patterns.',
      cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      status: 'Available',
    },
  ];

  for (const b of books) {
    batch.set(doc(firestore, 'books', b.id), b);
  }

  // 3. Seed Seats (24 Seats: A01 to D06 matching Figure 6.6)
  const initialOccupied = ['A03', 'A05', 'B02', 'B04', 'B06', 'C01', 'C04', 'D02', 'D05'];
  const rows = ['A', 'B', 'C', 'D'];

  for (const r of rows) {
    for (let c = 1; c <= 6; c++) {
      const seatNum = `${r}0${c}`;
      const isOcc = initialOccupied.includes(seatNum);
      batch.set(doc(firestore, 'seats', seatNum), {
        id: `s-${seatNum}`,
        seat_number: seatNum,
        row_letter: r,
        col_number: c,
        level: 'Level 2',
        status: isOcc ? 'Reserved' : 'Available',
        booked_by: isOcc ? 'Student' : null,
      });
    }
  }

  // 4. Seed Initial Reservations
  const defaultReservations = [
    {
      id: 'res-default-1',
      student_id: 'MU2024001',
      student_name: 'Arjun Mehta',
      reference_code: 'LH-2024-8841',
      type: 'Book',
      resource_id: 'b1',
      title: 'Introduction to Algorithms',
      pickup_location: 'Main Library, Counter 2',
      date: 'Sep 24, 2026',
      time_slot: '10:00 AM - 12:00 PM',
      due_date: 'Oct 02, 2026',
      status: 'Confirmed',
      created_at: new Date().toISOString(),
    },
    {
      id: 'res-default-2',
      student_id: 'MU2024001',
      student_name: 'Arjun Mehta',
      reference_code: 'LH-2024-4192',
      type: 'Seat',
      resource_id: 'A03',
      title: 'Seat A03 (Window)',
      pickup_location: 'Main Reading Room, Level 2',
      date: 'Sep 24, 2026',
      time_slot: '02:00 PM - 04:00 PM',
      due_date: null,
      status: 'Confirmed',
      created_at: new Date().toISOString(),
    },
  ];

  for (const r of defaultReservations) {
    batch.set(doc(firestore, 'reservations', r.id), r);
  }

  // 5. Seed Loans / Borrowing History (Figure 6.7)
  const defaultLoans = [
    {
      id: 'l1',
      student_id: 'MU2024001',
      book_id: 'b1',
      title: 'Introduction to Algorithms',
      borrow_date: 'Sep 18, 2026',
      due_date: 'Oct 02, 2026',
      return_date: null,
      status: 'Active',
      days_borrowed: '14d',
    },
    {
      id: 'l2',
      student_id: 'MU2024001',
      book_id: 'b-clean',
      title: 'Clean Code',
      borrow_date: 'Aug 27, 2024',
      due_date: 'Sep 10, 2024',
      return_date: 'Returned Sep 10, 2024',
      status: 'Returned',
      days_borrowed: '14d',
    },
    {
      id: 'l3',
      student_id: 'MU2024001',
      book_id: 'b-prag',
      title: 'The Pragmatic Programmer',
      borrow_date: 'Aug 07, 2024',
      due_date: 'Aug 28, 2024',
      return_date: 'Returned Aug 28, 2024',
      status: 'Returned',
      days_borrowed: '21d',
    },
    {
      id: 'l4',
      student_id: 'MU2024001',
      book_id: 'b-refact',
      title: 'Refactoring',
      borrow_date: 'Jul 29, 2024',
      due_date: 'Aug 05, 2024',
      return_date: 'Returned Aug 5, 2024',
      status: 'Returned',
      days_borrowed: '7d',
    },
  ];

  for (const l of defaultLoans) {
    batch.set(doc(firestore, 'loans', l.id), l);
  }

  // 6. Seed Notifications (Figure 6.8)
  const defaultNotifs = [
    {
      id: 'n1',
      student_id: 'MU2024001',
      title: 'Due Date Reminder',
      message: 'Introduction to Algorithms is due on October 2. Return or renew to avoid late fines.',
      type: 'warning',
      time_ago: '2 hours ago',
      is_read: 0,
    },
    {
      id: 'n2',
      student_id: 'MU2024001',
      title: 'Book Ready for Pickup',
      message: 'Design Patterns by Gang of Four is ready for collection at Desk 12, Floor 3.',
      type: 'success',
      time_ago: 'Yesterday',
      is_read: 0,
    },
    {
      id: 'n3',
      student_id: 'MU2024001',
      title: 'Seat Booking Reminder',
      message: 'Your reading-room seat reservation A03 starts in 30 minutes. Main Reading Room, Level 2.',
      type: 'info',
      time_ago: '2 days ago',
      is_read: 1,
    },
    {
      id: 'n4',
      student_id: 'MU2024001',
      title: 'Reservation Confirmed',
      message: 'Your book reservation #LH-2024-8841 has been successfully recorded in the library system.',
      type: 'success',
      time_ago: '3 days ago',
      is_read: 1,
    },
  ];

  for (const n of defaultNotifs) {
    batch.set(doc(firestore, 'notifications', n.id), n);
  }

  await batch.commit();
  console.log('Cloud Firestore successfully seeded with all library collections!');
};

// ========================================================
// 2. AUTHENTICATION & MULTI-USER CRUD (FIRESTORE)
// ========================================================

// CREATE: Register new student account in Cloud Firestore
export const registerUser = async ({ studentId, name, email, department, password }) => {
  const id = `u-${Date.now()}`;
  const avatarInitials = name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const cardId = `LIB-${studentId.toUpperCase()}`;

  const newUser = {
    id,
    student_id: studentId.trim(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    department: department.trim(),
    password: password || 'password123',
    avatar: avatarInitials,
    books_read: 0,
    days_active: 1,
    fines_paid: 0,
    library_card_id: cardId,
    card_status: 'Active',
    card_valid_until: 'Dec 2026',
    created_at: new Date().toISOString(),
  };

  await setDoc(doc(firestore, 'users', id), newUser);
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, id);
  return newUser;
};

// READ: Authenticate student against Cloud Firestore
export const loginUser = async (identifier, password) => {
  const trimmed = (identifier || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  if (!trimmed) return null;

  const usersCol = collection(firestore, 'users');
  const snap = await getDocs(usersCol);

  let user = null;
  snap.forEach((d) => {
    const data = d.data();
    const sid = (data.student_id || '').toLowerCase();
    const eml = (data.email || '').toLowerCase();
    const nm = (data.name || '').toLowerCase();

    if (
      sid === trimmed ||
      eml === trimmed ||
      nm === trimmed ||
      nm.includes(trimmed) ||
      d.id === trimmed
    ) {
      user = { id: d.id, ...data };
    }
  });

  // Auto-recovery for Arjun or Charitha if missing
  if (!user && (trimmed.includes('arjun') || trimmed === 'mu2024001' || trimmed === 'arjun@meridian.edu')) {
    user = {
      id: 'u1',
      student_id: 'MU2024001',
      name: 'Arjun Mehta',
      email: 'arjun@meridian.edu',
      department: 'Computer Science',
      password: 'password123',
      avatar: 'AM',
      books_read: 47,
      days_active: 186,
      fines_paid: 0,
      library_card_id: 'MU-LIB-2024-001',
      card_status: 'Active',
      card_valid_until: 'Dec 2026',
    };
    await setDoc(doc(firestore, 'users', 'u1'), user);
  } else if (!user && (trimmed.includes('charitha') || trimmed === 'it23336872' || trimmed === 'it23336872@my.sliit.lk')) {
    user = {
      id: 'u2',
      student_id: 'IT23336872',
      name: 'Charitha Dunusinhe',
      email: 'it23336872@my.sliit.lk',
      department: 'Information Technology',
      password: 'password123',
      avatar: 'CD',
      books_read: 15,
      days_active: 45,
      fines_paid: 0,
      library_card_id: 'SLIIT-LIB-IT23336872',
      card_status: 'Active',
      card_valid_until: 'Dec 2026',
    };
    await setDoc(doc(firestore, 'users', 'u2'), user);
  }

  if (!user) return null;

  // Password verification
  const expectedPassword = (user.password || 'password123').trim();
  const isDemo = user.student_id === 'MU2024001' || user.student_id === 'IT23336872';

  if (isDemo) {
    if (inputPass && inputPass !== 'password123' && inputPass !== expectedPassword) {
      return null;
    }
  } else {
    if (inputPass && expectedPassword !== inputPass) {
      return null;
    }
  }

  await AsyncStorage.setItem(SESSION_STORAGE_KEY, user.id);
  return user;
};

// READ: Get currently active logged-in student
export const getCurrentUser = async () => {
  const activeId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (activeId) {
    const snap = await getDoc(doc(firestore, 'users', activeId));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  }
  // Fallback to first user (Arjun)
  const snapU1 = await getDoc(doc(firestore, 'users', 'u1'));
  if (snapU1.exists()) {
    return { id: snapU1.id, ...snapU1.data() };
  }
  return null;
};

export const getUser = getCurrentUser;

export const getUserById = async (id) => {
  const snap = await getDoc(doc(firestore, 'users', id));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

export const getAllUsers = async () => {
  const snap = await getDocs(collection(firestore, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// UPDATE: Update profile of currently logged-in student in Firestore
export const updateUser = async (fields) => {
  const current = await getCurrentUser();
  if (!current) return null;

  const userRef = doc(firestore, 'users', current.id);
  await updateDoc(userRef, {
    ...fields,
    updated_at: new Date().toISOString(),
  });
  return await getUserById(current.id);
};

// DELETE: Sign out / clear active session
export const logoutUser = async () => {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
};

// ========================================================
// 3. BOOKS CRUD (FIRESTORE)
// ========================================================
export const getBooks = async (category = 'All') => {
  const booksCol = collection(firestore, 'books');
  const snap = await getDocs(booksCol);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (category && category !== 'All') {
    return list.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
  }
  return list;
};

export const getBookById = async (id) => {
  const snap = await getDoc(doc(firestore, 'books', id));
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
};

// ========================================================
// 4. SEATS CRUD (FIRESTORE)
// ========================================================
export const getSeats = async () => {
  const seatsCol = collection(firestore, 'seats');
  const snap = await getDocs(seatsCol);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Sort seats: A01 to D06
  return list.sort((a, b) => {
    if (a.row_letter === b.row_letter) {
      return (a.col_number || 0) - (b.col_number || 0);
    }
    return (a.row_letter || '').localeCompare(b.row_letter || '');
  });
};

export const updateSeatStatus = async (seatNumber, status, studentName = null) => {
  const seatRef = doc(firestore, 'seats', seatNumber);
  await updateDoc(seatRef, {
    status,
    booked_by: studentName,
    updated_at: new Date().toISOString(),
  });
  return await getSeats();
};

// ========================================================
// 5. RESERVATIONS CRUD (FIRESTORE)
// ========================================================
export const getReservations = async (allStudents = false) => {
  const resCol = collection(firestore, 'reservations');
  const snap = await getDocs(resCol);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Sort by created_at descending
  list.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

  if (allStudents) return list;

  const current = await getCurrentUser();
  if (!current) return list;

  return list.filter((r) => r.student_id === current.student_id);
};

export const createReservation = async ({
  type,
  resourceId,
  title,
  pickupLocation,
  date,
  timeSlot,
  dueDate,
}) => {
  const current = await getCurrentUser();
  const studentId = current ? current.student_id : 'MU2024001';
  const studentName = current ? current.name : 'Arjun Mehta';

  const id = `res-${Date.now()}`;
  const refCode = `LH-2024-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newRes = {
    id,
    student_id: studentId,
    student_name: studentName,
    reference_code: refCode,
    type,
    resource_id: resourceId,
    title,
    pickup_location: pickupLocation,
    date,
    time_slot: timeSlot || null,
    due_date: dueDate || null,
    status: 'Confirmed',
    created_at: now,
  };

  // 1. Create reservation in Firestore
  await setDoc(doc(firestore, 'reservations', id), newRes);

  // 2. Decrement book copies or reserve seat
  if (type === 'Book') {
    const bookRef = doc(firestore, 'books', resourceId);
    const bookSnap = await getDoc(bookRef);
    if (bookSnap.exists()) {
      const copies = Math.max(0, (bookSnap.data().copies_available || 1) - 1);
      await updateDoc(bookRef, {
        copies_available: copies,
        status: copies <= 0 ? 'Borrowed' : 'Available',
      });
    }
  } else if (type === 'Seat') {
    const seatRef = doc(firestore, 'seats', resourceId);
    await updateDoc(seatRef, {
      status: 'Reserved',
      booked_by: studentName,
    });
  }

  // 3. Create personal confirmation notification
  const notifId = `n-${Date.now()}`;
  await setDoc(doc(firestore, 'notifications', notifId), {
    id: notifId,
    student_id: studentId,
    title: 'Reservation Confirmed',
    message: `Your reservation #${refCode} for "${title}" has been registered in Cloud Firestore.`,
    type: 'success',
    time_ago: 'Just now',
    is_read: 0,
    created_at: now,
  });

  return newRes;
};

// UPDATE: Reschedule reservation time slot in Firestore
export const updateReservation = async (id, newTimeSlot) => {
  const resRef = doc(firestore, 'reservations', id);
  await updateDoc(resRef, {
    time_slot: newTimeSlot,
    updated_at: new Date().toISOString(),
  });
  return await getReservations();
};

// DELETE: Cancel reservation and restore resource availability
export const deleteReservation = async (id) => {
  const resRef = doc(firestore, 'reservations', id);
  const snap = await getDoc(resRef);

  if (snap.exists()) {
    const target = snap.data();

    // Restock Book or reopen Seat
    if (target.type === 'Book') {
      const bookRef = doc(firestore, 'books', target.resource_id);
      const bSnap = await getDoc(bookRef);
      if (bSnap.exists()) {
        const copies = (bSnap.data().copies_available || 0) + 1;
        await updateDoc(bookRef, {
          copies_available: copies,
          status: 'Available',
        });
      }
    } else if (target.type === 'Seat') {
      const seatRef = doc(firestore, 'seats', target.resource_id);
      await updateDoc(seatRef, {
        status: 'Available',
        booked_by: null,
      });
    }

    // Delete reservation doc
    await deleteDoc(resRef);
  }

  return await getReservations();
};

// ========================================================
// 6. NOTIFICATIONS CRUD (FIRESTORE)
// ========================================================
export const getNotifications = async () => {
  const notifsCol = collection(firestore, 'notifications');
  const snap = await getDocs(notifsCol);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const current = await getCurrentUser();
  if (current) {
    return list.filter((n) => n.student_id === current.student_id || !n.student_id);
  }
  return list;
};

export const markNotificationAsRead = async (id) => {
  const nRef = doc(firestore, 'notifications', id);
  await updateDoc(nRef, { is_read: 1 });
  return await getNotifications();
};

export const clearAllNotifications = async () => {
  const current = await getCurrentUser();
  const notifsCol = collection(firestore, 'notifications');
  const snap = await getDocs(notifsCol);

  const batch = writeBatch(firestore);
  snap.forEach((d) => {
    const data = d.data();
    if (!current || data.student_id === current.student_id) {
      batch.delete(d.ref);
    }
  });
  await batch.commit();
  return [];
};

// ========================================================
// 7. BORROWING HISTORY & STATS (FIRESTORE)
// ========================================================
export const getStudentBorrowHistory = async (userId) => {
  const current = await getCurrentUser();
  const studentId = current ? current.student_id : 'MU2024001';

  const loansCol = collection(firestore, 'loans');
  const snap = await getDocs(loansCol);
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return list.filter((l) => l.student_id === studentId);
};

export const getStudentStats = async (userId) => {
  const current = await getCurrentUser();
  const studentId = current ? current.student_id : 'MU2024001';

  const loans = await getStudentBorrowHistory(userId);
  const activeLoans = loans.filter((l) => l.status === 'Active').length;
  const returnedLoans = loans.filter((l) => l.status === 'Returned').length;

  const resList = await getReservations();
  const activeReservations = resList.filter((r) => r.status === 'Confirmed').length;

  return {
    booksBorrowed: activeLoans,
    booksRead: current?.books_read || (returnedLoans + activeLoans) || 12,
    activeReservations,
    dueSoon: activeLoans > 0 ? 1 : 0,
    daysActive: current?.days_active || 186,
    finesPaid: current?.fines_paid || 0,
  };
};

// RESET FIRESTORE TO INITIAL MILESTONE 02 SEED
export const resetDatabase = async () => {
  await seedFirestore();
};
