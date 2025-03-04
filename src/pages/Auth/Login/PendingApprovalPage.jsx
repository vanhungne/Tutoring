import { AlertCircle } from "lucide-react";

const PendingApprovalPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full text-center shadow-lg border border-gray-200 p-6 bg-white rounded-2xl">
                <div className="flex justify-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500" />
                </div>
                <h2 className="text-xl font-semibold mt-4">
                    Account Pending Approval
                </h2>
                <p className="text-gray-600 mt-2">
                    Thank you for signing up! We are reviewing your request to become a Tutor.
                </p>
                <p className="text-gray-600 mt-2">
                    You will receive an email notification once your account is approved.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                    If you need assistance, please contact us at <br />
                    <a href="mailto:support@tutorconnect.com" className="text-blue-600 hover:underline">
                        support@tutorconnect.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
