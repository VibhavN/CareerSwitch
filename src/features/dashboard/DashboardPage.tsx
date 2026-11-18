import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import {
    BriefcaseBusiness,
    CalendarDays,
    Clock,
    TrendingUp,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const statusLabels: Record<string, string> = {
    saved: "Saved",
    applied: "Applied",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    archived: "Archived",
};

function formatDate(value: string | null) {
    if (!value) return "Date not set";

    return new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function DashboardPage() {
    const { user } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        enabled: !!user,
        queryFn: async () => {
            const today = new Date().toISOString().slice(0, 10);

            const [applicationsResult, interviewsResult, activitiesResult] =
                await Promise.all([
                    supabase
                        .from("applications")
                        .select("id, company_name, job_title, status, next_follow_up_at")
                        .order("created_at", { ascending: false }),

                    supabase
                        .from("interviews")
                        .select("id, round_name, scheduled_at, status, application_id")
                        .eq("status", "scheduled")
                        .gte("scheduled_at", new Date().toISOString())
                        .order("scheduled_at", { ascending: true })
                        .limit(5),

                    supabase
                        .from("application_activities")
                        .select(
                            "id, activity_type, description, created_at, application_id",
                        )
                        .order("created_at", { ascending: false })
                        .limit(5),
                ]);

            if (applicationsResult.error) throw applicationsResult.error;
            if (interviewsResult.error) throw interviewsResult.error;
            if (activitiesResult.error) throw activitiesResult.error;

            const applications = applicationsResult.data;
            const interviews = interviewsResult.data;
            const activities = activitiesResult.data;

            const applicationMap = new Map(
                applications.map((application) => [application.id, application]),
            );

            return {
                applications,
                interviews,
                activities: activities.map((activity) => ({
                    ...activity,
                    application: applicationMap.get(activity.application_id),
                })),
                followUps: applications.filter(
                    (application) =>
                        application.next_follow_up_at &&
                        application.next_follow_up_at <= today &&
                        !["rejected", "withdrawn", "archived"].includes(application.status),
                ),
            };
        },
    });

    if (isLoading) {
        return <p className="text-sm text-gray-500">Loading your dashboard...</p>;
    }

    if (error) {
        return (
            <p role="alert" className="text-sm text-red-600">
                Couldn't load your dashboard: {error.message}
            </p>
        );
    }

    const applications = data?.applications ?? [];
    const interviews = data?.interviews ?? [];
    const activities = data?.activities ?? [];
    const followUps = data?.followUps ?? [];

    const statusCounts = applications.reduce<Record<string, number>>(
        (counts, application) => {
            counts[application.status] = (counts[application.status] ?? 0) + 1;
            return counts;
        },
        {},
    );

    const stats = [
        {
            label: "Total applications",
            value: applications.length,
            icon: BriefcaseBusiness,
        },
        {
            label: "Interviews scheduled",
            value: interviews.length,
            icon: CalendarDays,
        },
        {
            label: "Follow-ups due",
            value: followUps.length,
            icon: Clock,
        },
        {
            label: "Offers received",
            value: statusCounts.offer ?? 0,
            icon: TrendingUp,
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Here's an overview of your job search.
                </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="rounded-xl border border-gray-200 bg-white p-5"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{label}</p>
                            <Icon size={20} className="text-indigo-600" />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
                    </div>
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="font-semibold text-gray-900">Application pipeline</h2>

                    {applications.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            No applications yet. Add your first application to see your
                            pipeline here.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {Object.entries(statusLabels).map(([status, label]) => {
                                const count = statusCounts[status] ?? 0;
                                const percentage = (count / applications.length) * 100;

                                return (
                                    <div key={status}>
                                        <div className="mb-1 flex justify-between text-sm">
                                            <span className="text-gray-600">{label}</span>
                                            <span className="font-medium text-gray-900">{count}</span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className="h-full rounded-full bg-indigo-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="font-semibold text-gray-900">Upcoming interviews</h2>

                    {interviews.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            No upcoming interviews. Interviews you schedule will appear here.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {interviews.map((interview) => {
                                const application = applications.find(
                                    (item) => item.id === interview.application_id,
                                );

                                return (
                                    <div
                                        key={interview.id}
                                        className="border-b border-gray-100 pb-3 last:border-0"
                                    >
                                        <p className="font-medium text-gray-900">
                                            {interview.round_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {application?.company_name ?? "Company"}
                                            {" · "}
                                            {formatDate(interview.scheduled_at)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="font-semibold text-gray-900">Follow-ups</h2>

                    {followUps.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            No follow-ups due. You're all caught up.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {followUps.slice(0, 5).map((application) => (
                                <div key={application.id}>
                                    <p className="font-medium text-gray-900">
                                        {application.company_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {application.job_title}
                                        {" · "}
                                        Due {formatDate(application.next_follow_up_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="font-semibold text-gray-900">Recent activity</h2>

                    {activities.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            Your application activity will appear here.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id}>
                                    <p className="font-medium text-gray-900">
                                        {activity.application?.company_name ?? "Application"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {activity.description ?? activity.activity_type}
                                        {" · "}
                                        {formatDate(activity.created_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
