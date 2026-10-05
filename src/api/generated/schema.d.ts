export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** health */
        get: operations["health"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** readiness */
        get: operations["readiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** auth Config */
        get: operations["authConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** register */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** login */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/google": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** google Login */
        post: operations["googleLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** logout */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** profile */
        get: operations["profile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** founder Overview */
        get: operations["founderOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** update Profile */
        patch: operations["updateProfile"];
        trace?: never;
    };
    "/api/auth/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** change Password */
        patch: operations["changePassword"];
        trace?: never;
    };
    "/api/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** forgot Password */
        post: operations["forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/auth/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** reset Password */
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** campaigns */
        get: operations["campaigns"];
        put?: never;
        /** create Campaign */
        post: operations["createCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists/design": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** generate Design */
        post: operations["generateDesign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** campaign */
        get: operations["campaign"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** update Campaign */
        patch: operations["updateCampaign"];
        trace?: never;
    };
    "/api/waitlists/{id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** campaign Stats */
        get: operations["campaignStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists/{id}/funnel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** campaign Funnel */
        get: operations["campaignFunnel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists/{id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** export Subscribers */
        get: operations["exportSubscribers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/waitlists/{id}/signups/{signupId}/position": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** update Position */
        patch: operations["updatePosition"];
        trace?: never;
    };
    "/api/waitlists/{id}/signups/batch-invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** invite Subscribers */
        post: operations["inviteSubscribers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** public Campaign */
        get: operations["publicCampaign"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** join Campaign */
        post: operations["joinCampaign"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/status-link": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** request Status Link */
        post: operations["requestStatusLink"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** verify Subscriber */
        post: operations["verifySubscriber"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/position": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** subscriber Position */
        get: operations["subscriberPosition"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/leaderboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** referrer Leaderboard */
        get: operations["referrerLeaderboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** recent Activity */
        get: operations["recentActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/w/{slug}/visit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** record Visit */
        post: operations["recordVisit"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/discover/leaderboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** discover Products */
        get: operations["discoverProducts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/checkout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** checkout */
        post: operations["checkout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/portal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** billing Portal */
        get: operations["billingPortal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/payments/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** billing Webhook */
        post: operations["billingWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** admin Overview */
        get: operations["adminOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/founders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** admin Admin Founder */
        get: operations["adminAdminFounder"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/campaigns": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** admin Admin Campaign */
        get: operations["adminAdminCampaign"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/subscribers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** admin Admin Subscriber */
        get: operations["adminAdminSubscriber"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/campaigns/{id}/discovery": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** moderate Discovery */
        patch: operations["moderateDiscovery"];
        trace?: never;
    };
    "/api/admin/diagnostics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** diagnostics */
        get: operations["diagnostics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/monitoring": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** monitoring */
        get: operations["monitoring"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/traces": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** traces */
        get: operations["traces"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/admin/traces/{traceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** trace */
        get: operations["trace"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/telemetry/vitals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** web Vitals */
        post: operations["webVitals"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Error: {
            error: string;
        } & {
            [key: string]: unknown;
        };
        Message: {
            message: string;
        };
        Founder: {
            id: string;
            name: string;
            /** Format: email */
            email: string;
            /** @enum {string} */
            plan: "free" | "starter" | "pro" | "agency";
            customerPortalUrl: string | null;
            /** @enum {string} */
            authProvider: "local" | "google";
            /** Format: date-time */
            createdAt: string;
            subscriptionStatus: string;
            subscriptionEndsAt: string | null;
            isAdmin: boolean;
        };
        Auth: {
            token: string;
            founder: components["schemas"]["Founder"];
        };
        Profile: {
            founder: components["schemas"]["Founder"];
        };
        Feature: {
            _id?: string;
            icon: string;
            title: string;
            description: string;
        };
        Milestone: {
            _id?: string;
            referrals: number;
            reward: string;
        };
        PageDesign: {
            /** @enum {string} */
            layout: "centered" | "split" | "editorial";
            backgroundColor: string;
            surfaceColor: string;
            /** @enum {string} */
            fontFamily: "sans" | "serif" | "mono";
            /** @enum {string} */
            cornerStyle: "sharp" | "rounded" | "pill";
            /** @enum {string} */
            backgroundStyle: "solid" | "gradient" | "grid";
            eyebrow: string;
            signupHeading: string;
            featureHeading: string;
            rewardHeading: string;
            logoUrl: "" | string;
            sectionOrder: ("features" | "story" | "steps" | "faq" | "rewards" | "leaderboard")[];
            story: {
                title: string;
                body: string;
            };
            steps: {
                title: string;
                description: string;
            }[];
            faq: {
                question: string;
                answer: string;
            }[];
        };
        DesignDraft: {
            heroHeadline: string;
            heroSubheadline: string;
            ctaText: string;
            accentColor: string;
            features: {
                icon: string;
                title: string;
                description: string;
            }[];
            pageDesign: {
                /** @enum {string} */
                layout: "centered" | "split" | "editorial";
                backgroundColor: string;
                surfaceColor: string;
                /** @enum {string} */
                fontFamily: "sans" | "serif" | "mono";
                /** @enum {string} */
                cornerStyle: "sharp" | "rounded" | "pill";
                /** @enum {string} */
                backgroundStyle: "solid" | "gradient" | "grid";
                eyebrow: string;
                signupHeading: string;
                featureHeading: string;
                rewardHeading: string;
                logoUrl: "" | string;
                sectionOrder: ("features" | "story" | "steps" | "faq" | "rewards" | "leaderboard")[];
                story: {
                    title: string;
                    body: string;
                };
                steps: {
                    title: string;
                    description: string;
                }[];
                faq: {
                    question: string;
                    answer: string;
                }[];
            };
        };
        Campaign: {
            _id: string;
            founderId: string;
            name: string;
            slug: string;
            description: string;
            thankYouMessage?: string;
            signupSequence?: number;
            queueVersion?: number;
            paused: boolean;
            discoverable: boolean;
            discoveryHidden?: boolean;
            heroHeadline?: string;
            heroSubheadline?: string;
            heroImageUrl?: string;
            accentColor: string;
            ctaText?: string;
            pageDesign?: components["schemas"]["PageDesign"];
            features: components["schemas"]["Feature"][];
            milestones: components["schemas"]["Milestone"][];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            __v?: number;
            signupCount?: number;
        };
        CampaignResponse: {
            waitlist: components["schemas"]["Campaign"];
        };
        CampaignList: {
            waitlists: components["schemas"]["Campaign"][];
        };
        Subscriber: {
            _id: string;
            waitlistId?: string;
            /** Format: email */
            email: string;
            refCode?: string;
            referredBy?: string | null;
            basePosition?: number;
            currentPosition: number | null;
            initialPosition?: number;
            priorityOffset?: number;
            referralCount?: number;
            /** @enum {string} */
            invitationState?: "none" | "queued" | "sent" | "failed";
            /** @enum {string} */
            verificationState?: "legacy" | "pending" | "verified";
            /** @enum {string} */
            status?: "waiting" | "invited";
            /** Format: date-time */
            verifiedAt?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            __v?: number;
            queueScore?: number;
            queueEligible?: boolean;
            queueOrder?: {
                score: number;
                sequence: number;
                id: string;
            };
        };
        Pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        AdminPagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
        Referrer: {
            _id: string;
            email: string;
            refCode: string;
            currentPosition: number;
            status: string;
            referralCount: number;
            totalReferralCount: number;
        };
        Stats: {
            waitlist: components["schemas"]["Campaign"];
            totalVisitors: number;
            totalSignups: number;
            verifiedSignups: number;
            pendingSignups: number;
            conversionRate: number;
            signupsToday: number;
            referralRate: number;
            topReferrers: components["schemas"]["Referrer"][];
            signups: components["schemas"]["Subscriber"][];
            chartData: {
                /** Format: date */
                date: string;
                signups: number;
            }[];
            /** @enum {string} */
            timezone: "UTC";
            pagination: components["schemas"]["Pagination"];
        };
        Funnel: {
            totalPageViews: number;
            totalVisitors: number;
            totalSignups: number;
            directSignups: number;
            referredSignups: number;
            conversionRate: number;
            topReferrers: components["schemas"]["Referrer"][];
        };
        CampaignSummary: {
            _id: string;
            name: string;
            slug: string;
            paused: boolean;
            discoverable: boolean;
            discoveryHidden: boolean;
            /** Format: date-time */
            createdAt: string;
            signupCount: number;
            confirmedCount: number;
        };
        FounderOverview: {
            campaigns: components["schemas"]["CampaignSummary"][];
            usage: {
                campaigns: number;
                signups: number;
                confirmed: number;
            };
            limits: {
                campaigns: number | null;
                signups: number | null;
            };
        };
        Discovery: {
            products: {
                name: string;
                slug: string;
                description: string;
                accentColor: string;
                members: number;
                weeklyMembers: number;
                rank: number;
            }[];
            /** @enum {string} */
            period: "week" | "all";
            /** Format: date-time */
            updatedAt: string;
        };
        PublicCampaign: {
            name: string;
            description: string;
            slug: string;
            paused: boolean;
            totalSignups: number;
            heroHeadline?: string;
            heroSubheadline?: string;
            heroImageUrl?: string;
            accentColor: string;
            ctaText: string;
            pageDesign?: components["schemas"]["PageDesign"];
            features: components["schemas"]["Feature"][];
            milestones: components["schemas"]["Milestone"][];
        };
        StatusLink: {
            /** @constant */
            statusLinkSent: true;
            message: string;
        };
        SubscriberStatus: {
            position: number;
            basePosition: number;
            referralCount: number;
            positionsGained: number;
            refCode: string;
            email: string;
            waitlistName: string;
            milestones: components["schemas"]["Milestone"][];
            alreadyJoined: boolean;
            statusToken: string;
        };
        PublicLeaderboard: {
            leaderboard: {
                _id: string;
                rank: number;
                anonymizedEmail: string;
                email: string;
                referralCount: number;
                currentPosition: number;
            }[];
        };
        Activity: {
            activities: {
                id: string;
                userMasked: string;
                position: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        BatchInvitation: {
            invitedCount: number;
            queuedCount: number;
            failedCount: number;
        };
        AdminFounder: {
            _id: string;
            name: string;
            email: string;
            /** @enum {string} */
            plan: "free" | "starter" | "pro" | "agency";
            authProvider: string;
            subscriptionStatus?: string;
            /** Format: date-time */
            subscriptionEndsAt?: string;
            /** Format: date-time */
            createdAt: string;
            /** @enum {string} */
            effectivePlan: "free" | "starter" | "pro" | "agency";
            campaignCount: number;
        };
        AdminCampaign: {
            _id: string;
            name: string;
            slug: string;
            founderId: {
                _id: string;
                name: string;
                email: string;
            } | null;
            paused: boolean;
            discoverable: boolean;
            discoveryHidden: boolean;
            /** Format: date-time */
            createdAt: string;
            signupCount: number;
        };
        AdminSubscriber: {
            _id: string;
            email: string;
            waitlistId: {
                _id: string;
                name: string;
                slug: string;
            } | null;
            status: string;
            verificationState: string;
            invitationState: string;
            referralCount: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            verifiedAt?: string;
        };
        AdminOverview: {
            totals: {
                founders: number;
                campaigns: number;
                subscribers: number;
                pendingVerification: number;
                newFounders: number;
                listedProducts: number;
            };
            delivery: {
                _id: string;
                count: number;
            }[];
            plans: {
                _id: {
                    /** @enum {string} */
                    plan: "free" | "starter" | "pro" | "agency";
                    status?: string;
                };
                count: number;
            }[];
        };
        Metric: {
            label: string;
            count: number;
            failures: number;
            mean: number;
            p50: number;
            p95: number;
            sampled: number;
        };
        Diagnostics: {
            scope: string;
            uptimeSeconds: number;
            percentiles: string;
            memoryBytes: {
                rss: number;
                heapUsed: number;
            };
            eventLoopP95Ms: number | null;
            requests: components["schemas"]["Metric"][];
            operations: components["schemas"]["Metric"][];
            webVitals: components["schemas"]["Metric"][];
            units: {
                requests: string;
                operations: string;
                LCP: string;
                INP: string;
                CLS: string;
            };
            emailOutbox: {
                states: {
                    [key: string]: number;
                };
                oldestUnsentAgeSeconds: number;
            };
        };
        MonitoringStorage: {
            enabled: boolean;
            retentionDays: number;
            bufferedLabels: number;
            pendingBatches: number;
            droppedObservations: number;
            lastPersistedAt: string | null;
        };
        MonitoringSeries: {
            /** @enum {string} */
            name: "http" | "operation" | "LCP" | "INP" | "CLS";
            label: string;
            count: number;
            failures: number;
            goodRate: number;
            threshold: number;
            targetGoodRate: number;
            mean: number;
            p75UpperBound: number | null;
            p95UpperBound: number | null;
            availability: number | null;
            /** @enum {string} */
            status: "warming" | "met" | "breached";
        };
        Monitoring: {
            windowHours: number;
            storage: components["schemas"]["MonitoringStorage"];
            objectives: {
                observedHttpAvailability: number;
                httpLatencyGoodRate: number;
                webVitalsGoodRate: number;
                minimumObservations: number;
                percentiles: string;
                population: string;
            };
            series: components["schemas"]["MonitoringSeries"][];
        };
        TraceSpan: {
            traceId: string;
            spanId: string;
            parentSpanId: string | null;
            name: string;
            serviceName: string;
            /** Format: date-time */
            startedAt: string;
            durationMs: number;
            status: number;
            route?: string;
            method?: string;
            responseStatus?: number;
        };
        RegisterRequest: {
            /** Format: email */
            email: string;
            password: string;
        };
        LoginRequest: {
            /** Format: email */
            email: string;
            password: string;
        };
        ProfileRequest: {
            name?: string;
            /** Format: email */
            email?: string;
        };
        PasswordRequest: {
            currentPassword: string;
            newPassword: string;
        };
        EmailRequest: {
            /** Format: email */
            email: string;
        };
        ResetRequest: {
            token: string;
            newPassword: string;
        };
        CampaignCreateRequest: {
            /** @default false */
            discoverable: boolean;
            name: string;
            /** @default  */
            description: string;
            heroHeadline?: string;
            heroSubheadline?: string;
            heroImageUrl?: "" | string;
            accentColor?: string;
            ctaText?: string;
            features?: {
                icon: string;
                title: string;
                description: string;
            }[];
            pageDesign?: {
                /** @enum {string} */
                layout: "centered" | "split" | "editorial";
                backgroundColor: string;
                surfaceColor: string;
                /** @enum {string} */
                fontFamily: "sans" | "serif" | "mono";
                /** @enum {string} */
                cornerStyle: "sharp" | "rounded" | "pill";
                /** @enum {string} */
                backgroundStyle: "solid" | "gradient" | "grid";
                eyebrow: string;
                signupHeading: string;
                featureHeading: string;
                rewardHeading: string;
                logoUrl: "" | string;
                sectionOrder: ("features" | "story" | "steps" | "faq" | "rewards" | "leaderboard")[];
                story: {
                    title: string;
                    body: string;
                };
                steps: {
                    title: string;
                    description: string;
                }[];
                faq: {
                    question: string;
                    answer: string;
                }[];
            };
            thankYouMessage?: string;
            milestones?: {
                referrals: number;
                reward: string;
            }[];
        };
        CampaignUpdateRequest: {
            discoverable?: boolean;
            name?: string;
            description?: string;
            thankYouMessage?: string;
            paused?: boolean;
            heroHeadline?: string;
            heroSubheadline?: string;
            heroImageUrl?: "" | string;
            accentColor?: string;
            ctaText?: string;
            features?: {
                /** @default ✨ */
                icon: string;
                title: string;
                /** @default  */
                description: string;
            }[];
            milestones?: {
                referrals: number;
                reward: string;
            }[];
            pageDesign?: {
                /** @enum {string} */
                layout: "centered" | "split" | "editorial";
                backgroundColor: string;
                surfaceColor: string;
                /** @enum {string} */
                fontFamily: "sans" | "serif" | "mono";
                /** @enum {string} */
                cornerStyle: "sharp" | "rounded" | "pill";
                /** @enum {string} */
                backgroundStyle: "solid" | "gradient" | "grid";
                eyebrow: string;
                signupHeading: string;
                featureHeading: string;
                rewardHeading: string;
                logoUrl: "" | string;
                sectionOrder: ("features" | "story" | "steps" | "faq" | "rewards" | "leaderboard")[];
                story: {
                    title: string;
                    body: string;
                };
                steps: {
                    title: string;
                    description: string;
                }[];
                faq: {
                    question: string;
                    answer: string;
                }[];
            };
        };
        JoinRequest: {
            /** Format: email */
            email: string;
            ref?: string;
        };
        VerifyRequest: {
            token: string;
        };
        PositionRequest: {
            currentPosition: number;
        };
        InviteRequest: {
            signupIds: string[];
        };
        VisitRequest: {
            visitorId: string;
        };
        GenerateDesignRequest: {
            name: string;
            /** @default  */
            description: string;
            preferences: {
                brief: string;
                /** @default  */
                audience: string;
                /**
                 * @default professional
                 * @enum {string}
                 */
                tone: "professional" | "playful" | "calm" | "bold";
                /**
                 * @default auto
                 * @enum {string}
                 */
                layout: "auto" | "centered" | "split" | "editorial";
                /** @default  */
                accentColor: "" | string;
            };
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    health: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        status: string;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    readiness: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        status: string;
                        database: boolean;
                        redis: string;
                    };
                };
            };
            /** @description Database not ready */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        status: string;
                        database: boolean;
                        redis: string;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    authConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        googleClientId: string | null;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterRequest"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Auth"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Auth"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    googleLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    credential: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Auth"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    profile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    founderOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FounderOverview"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfileRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Message"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    campaigns: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CampaignList"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    createCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CampaignCreateRequest"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CampaignResponse"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    generateDesign: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateDesignRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        design: components["schemas"]["DesignDraft"];
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    campaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CampaignResponse"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updateCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CampaignUpdateRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CampaignResponse"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    campaignStats: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Stats"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    campaignFunnel: {
        parameters: {
            query?: {
                days?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Funnel"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    exportSubscribers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/csv": string;
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    updatePosition: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                signupId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PositionRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        signup: components["schemas"]["Subscriber"];
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    inviteSubscribers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InviteRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BatchInvitation"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    publicCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicCampaign"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    joinCampaign: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JoinRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StatusLink"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    requestStatusLink: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StatusLink"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    verifySubscriber: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriberStatus"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    subscriberPosition: {
        parameters: {
            query?: never;
            header: {
                "X-Subscriber-Token": string;
            };
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriberStatus"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    referrerLeaderboard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicLeaderboard"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    recentActivity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Activity"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    recordVisit: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VisitRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        recorded: boolean;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    discoverProducts: {
        parameters: {
            query?: {
                period?: "week" | "all";
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Discovery"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    checkout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    plan: "starter" | "pro" | "agency";
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        checkoutUrl: string;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    billingPortal: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        portalUrl: string;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    billingWebhook: {
        parameters: {
            query?: never;
            header: {
                "X-Signature": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    [key: string]: unknown;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        received: boolean;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    adminOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminOverview"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    adminAdminFounder: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                search?: string;
                founderId?: string;
                waitlistId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["AdminFounder"][];
                        pagination: components["schemas"]["AdminPagination"];
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    adminAdminCampaign: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                search?: string;
                founderId?: string;
                waitlistId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["AdminCampaign"][];
                        pagination: components["schemas"]["AdminPagination"];
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    adminAdminSubscriber: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
                search?: string;
                founderId?: string;
                waitlistId?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        items: components["schemas"]["AdminSubscriber"][];
                        pagination: components["schemas"]["AdminPagination"];
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    moderateDiscovery: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    discoveryHidden: boolean;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        campaign: {
                            _id: string;
                            discoveryHidden: boolean;
                        };
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    diagnostics: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Diagnostics"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    monitoring: {
        parameters: {
            query?: {
                hours?: number;
                errorsOnly?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Monitoring"];
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    traces: {
        parameters: {
            query?: {
                hours?: number;
                errorsOnly?: "true" | "false";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        traces: components["schemas"]["TraceSpan"][];
                        limit: number;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    trace: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                traceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        traceId: string;
                        spans: components["schemas"]["TraceSpan"][];
                        truncated: boolean;
                    };
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
    webVitals: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "text/plain": string;
            };
        };
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Untrusted or missing Origin */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
            /** @description Validation, authorization, conflict, throttling or dependency failure */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Error"];
                };
            };
        };
    };
}
