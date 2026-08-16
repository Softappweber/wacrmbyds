// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Functions
function showAuth(type) {
    if (type === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }
}

async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    
    if (error) {
        document.getElementById('authMessage').textContent = error.message;
    } else {
        document.getElementById('authMessage').textContent = 'Sign up successful! Please check your email to confirm.';
        document.getElementById('authMessage').className = 'text-success mt-2';
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        document.getElementById('authMessage').textContent = error.message;
    } else {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userDisplay').textContent = `Welcome, ${data.user.email}`;
        loadDashboard();
    }
}

async function logout() {
    await supabase.auth.signOut();
    location.reload();
}

// Dashboard Functions
async function loadDashboard() {
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*');
    
    if (leads) {
        document.getElementById('totalLeads').textContent = leads.length;
        
        const activeLeads = leads.filter(lead => lead.status !== 'Converted' && lead.status !== 'Lost');
        document.getElementById('activeLeads').textContent = activeLeads.length;
        
        const convertedLeads = leads.filter(lead => lead.status === 'Converted');
        document.getElementById('convertedLeads').textContent = convertedLeads.length;
    }
}

// Check auth on load
window.onload = async function() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userDisplay').textContent = `Welcome, ${user.email}`;
        loadDashboard();
    }
};
