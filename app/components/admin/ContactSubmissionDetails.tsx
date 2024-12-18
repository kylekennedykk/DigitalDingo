import { Timestamp } from 'firebase/firestore';
import ContactSubmissionNotes from './ContactSubmissionNotes';

interface Note {
  text: string;
  timestamp: Timestamp;
  author: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Timestamp;
  status: string;
  notes?: Note[];
}

const ContactSubmissionDetails: React.FC<{ submission: ContactSubmission }> = ({ submission }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact Details</h2>
      
      <div className="mb-4">
        <p><strong>Name:</strong> {submission.name}</p>
        <p><strong>Email:</strong> {submission.email}</p>
        <p><strong>Message:</strong> {submission.message}</p>
        <p><strong>Status:</strong> {submission.status}</p>
        <p><strong>Submitted:</strong> {submission.createdAt?.toDate().toLocaleString()}</p>
      </div>

      <ContactSubmissionNotes 
        submissionId={submission.id}
        submission={submission}
      />
    </div>
  );
};

export default ContactSubmissionDetails; 