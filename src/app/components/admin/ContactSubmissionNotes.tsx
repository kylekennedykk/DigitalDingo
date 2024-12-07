import React, { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface Note {
  text: string;
  timestamp: Timestamp;
  author: string;
}

interface ContactSubmissionNotesProps {
  submissionId: string;
  submission: {
    notes?: Note[];
    [key: string]: any;
  };
}

const ContactSubmissionNotes: React.FC<ContactSubmissionNotesProps> = ({ submissionId, submission }) => {
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>(submission.notes || []);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for real-time updates to notes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'contactSubmissions', submissionId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setNotes(data.notes || []);
        }
      },
      (error) => {
        console.error('Error listening to notes:', error);
        toast.error('Error loading notes. Please refresh the page.');
      }
    );

    return () => unsubscribe();
  }, [submissionId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    if (!auth.currentUser) {
      toast.error('You must be logged in to add notes');
      return;
    }

    setIsLoading(true);

    try {
      const submissionRef = doc(db, 'contactSubmissions', submissionId);
      
      await updateDoc(submissionRef, {
        notes: [...notes, {
          text: newNote.trim(),
          timestamp: serverTimestamp(),
          author: auth.currentUser.email || 'Unknown'
        }]
      });

      setNewNote(''); // Clear input after successful add
      toast.success('Note added successfully');
    } catch (error: any) {
      console.error('Error adding note:', error);
      if (error.code === 'permission-denied') {
        toast.error('You do not have permission to add notes');
      } else {
        toast.error('Failed to add note. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Notes</h3>
      
      {/* Notes input section */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Add a note..."
        />
        <button
          onClick={handleAddNote}
          disabled={!newNote.trim() || isLoading}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Note'}
        </button>
      </div>

      {/* Notes display section */}
      <div className="space-y-2">
        {notes.slice().reverse().map((note, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{note.author}</span>
              <span>{note.timestamp?.toDate().toLocaleString()}</span>
            </div>
            <p className="mt-1">{note.text}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  );
};

export default ContactSubmissionNotes; 