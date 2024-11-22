import { createClient, Provider, Session } from '@supabase/supabase-js'
import { notifications } from '@mantine/notifications';
import { defaultViewport } from './Utilities';

export const SUPABASE_URL = "https://tugoremjbojyqanvwglz.supabase.co"
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z29yZW1qYm9qeXFhbnZ3Z2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0MTk2ODgsImV4cCI6MjA0Mzk5NTY4OH0.RvmWr4VrQ0ioRR34vpGYeBEz8qFOPh68ZURNf41yhts"
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const flowKey = 'axon-flow';


export const handleSignUp = async (
    email: string,
    password: string,
    setSession: React.Dispatch<React.SetStateAction<Session | null>>,
    setSignUpOpened: React.Dispatch<React.SetStateAction<boolean>>,

) => {
    console.log(`Signing up`);

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Error signing up:', error.message);
        notifications.show({
            title: 'Error Signing Up',
            message: error.message,
            color: 'red',
        });
        return;
    }

    console.log('Sign up successful:', data);
    setSession(data.session);

    setSignUpOpened(false);
};

export const handleSignIn = async (
    email: string,
    password: string,
    setSession: (value: any) => void,
    setNodes: (nodeList: any[]) => void,
    setEdges: (edgeList: any[]) => void,
    reactFlowInstance: any,
    setSignInOpened: (value: boolean) => void
) => {
    console.log(`Signing in`);

    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (sessionError) {
        console.error('Error signing in:', sessionError);
        notifications.show({
            title: 'Error Signing In',
            message: sessionError.message,
            color: 'red',
        });
        return;
    }

    console.log('Sign in successful:', sessionData);

    setSession(sessionData.session);

    // try to get saved json from supabase
    const { data, error } = await supabase
        .from('user_data')
        .select()
        .eq('user_id', sessionData.session.user.id)
        .limit(1)
        .single()

    if (error) {
        console.log("failed to retrieve user's nodes", error);
        return;
    }

    console.log(data.user_data)
    const flow = data.user_data
    console.log(flow.nodes, flow.edges)
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (reactFlowInstance) {
        reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
    }


    setSignInOpened(false);
};

export const handleOauthSignIn = async (provider: string) => {
    let gotrue_provider: Provider | null = null;
    switch (provider) {
        case "google":
            gotrue_provider = 'google';
            break;
        case "github":
            gotrue_provider = 'github';
            break;
        default:
            console.error("Invalid provider: ", provider)
    }
    if (gotrue_provider) {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: gotrue_provider
        })
        console.log(data, error)
        if (error) {
            notifications.show({
                title: 'Error Signing In',
                message: error.message,
                color: 'red',
            });
        }
    }
}

export const handleLogOut = async (
    setSession: (value: any) => void,
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: any[]) => void,
    reactFlowInstance: any
) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error.message)
        notifications.show({
            title: 'Error Logging Out',
            message: error.message,
            color: 'red',
        });
    } else {
        setSession(null);
        const flowJson = localStorage.getItem(flowKey);
        if (flowJson != null) {
            console.log("user logged out, clearing canvas and replacing from local storage", flowJson);
            const flow = JSON.parse(flowJson);
            if (flow) {
                // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                console.log(flow.nodes, flow.edges)
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                if (reactFlowInstance) {
                    reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
                }
                // setViewport({ x, y, zoom });
            }
        } else {
            console.log("user logged out, clearing canvas - localstorage empty", flowJson);
            setNodes([]);
            setEdges([]);
            if (reactFlowInstance) {
                reactFlowInstance?.setViewport(defaultViewport)
            }
        }
    }

};

export const fetchSession = async (
    setSession: (value: any) => void,
    setNodes: (nodes: any[]) => void,
    setEdges: (edges: any[]) => void,
    reactFlowInstance: any,
    setLoading: (value: boolean) => void
) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionData?.session) {
        setSession(sessionData.session);
        console.log("retrieved session: ", sessionData)

        // try to get saved json from supabase
        const { data, error } = await supabase
            .from('user_data')
            .select()
            .eq('user_id', sessionData.session.user.id)
            .limit(1)
            .single()


        if (error) {
            console.log("failed to retrieve user's nodes", error);
            if (error.code === "406" || error.code === "PGRST116") {
                // add new row for user if it doesn't exist
                console.log("user has no rows in database, adding empty row, or localstorage if it exists", console.log(localStorage.getItem(flowKey)))
                const { data, error } = await supabase
                    .from('user_data')
                    .upsert({ user_id: sessionData.session.user.id, user_data: JSON.parse(localStorage.getItem(flowKey) ?? "{}") })
                    .select()

                // clear user's local storage after it's copied so it doesn't show up after they log out
                if (localStorage.getItem(flowKey)) {
                    localStorage.removeItem(flowKey)
                }
                if (error) {
                    notifications.show({
                        title: 'Error Fetching Session',
                        message: error.message,
                        color: 'red',
                    });
                } else {
                    console.log("retrieved: ", data)
                }
            } else {
                notifications.show({
                    title: 'Error Fetching Session',
                    message: error.message,
                    color: 'red',
                });
                return;
            }
        }

        if (data != null) {
            console.log(data.user_data)
            const flow = data.user_data
            console.log(flow, flow.nodes, flow.edges)
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (reactFlowInstance) {
                reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
            }
        }




    } else if (sessionError) {
        console.log("Error when retrieving session:", sessionError);
    } else {
        const flowJson = localStorage.getItem(flowKey);
        if (flowJson != null) {
            const flow = JSON.parse(flowJson);
            console.log("no session, restoring state from local storage: ", flow)
            if (flow) {
                // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                console.log(flow.nodes, flow.edges)
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                if (reactFlowInstance) {
                    reactFlowInstance?.setViewport(flow.viewport || defaultViewport)
                }
                // setViewport({ x, y, zoom });
            }
        }

    }

    // Set loading to false after fetching session
    setLoading(false);
};