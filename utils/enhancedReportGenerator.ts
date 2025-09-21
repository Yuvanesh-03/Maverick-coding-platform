import { jsPDF } from 'jspdf';
import { UserProfile } from '../types';

// Enhanced PDF Report Generator with better styling and customization
export class EnhancedReportGenerator {
    private doc: jsPDF;
    private pageHeight: number;
    private pageWidth: number;
    private margin: number;
    private currentY: number;
    private colors = {
        primary: [52, 73, 94] as [number, number, number],
        secondary: [52, 152, 219] as [number, number, number],
        success: [46, 204, 113] as [number, number, number],
        warning: [241, 196, 15] as [number, number, number],
        danger: [231, 76, 60] as [number, number, number],
        light: [236, 240, 241] as [number, number, number],
        dark: [52, 73, 94] as [number, number, number]
    };

    constructor() {
        this.doc = new jsPDF();
        this.pageHeight = this.doc.internal.pageSize.height;
        this.pageWidth = this.doc.internal.pageSize.width;
        this.margin = 20;
        this.currentY = this.margin;
    }

    private addHeader(title: string, subtitle?: string) {
        // Background header
        this.doc.setFillColor(...this.colors.primary);
        this.doc.rect(0, 0, this.pageWidth, 40, 'F');

        // Title
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(24);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(title, this.pageWidth / 2, 20, { align: 'center' });

        if (subtitle) {
            this.doc.setFontSize(12);
            this.doc.setFont(undefined, 'normal');
            this.doc.text(subtitle, this.pageWidth / 2, 30, { align: 'center' });
        }

        this.currentY = 50;
    }

    private addSection(title: string) {
        this.checkPageBreak(30);
        
        // Section background
        this.doc.setFillColor(...this.colors.light);
        this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 20, 'F');
        
        // Section title
        this.doc.setTextColor(...this.colors.primary);
        this.doc.setFontSize(16);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(title, this.margin + 5, this.currentY + 8);
        
        this.currentY += 25;
    }

    private addText(text: string, fontSize: number = 11, bold: boolean = false) {
        this.checkPageBreak(15);
        
        this.doc.setTextColor(...this.colors.dark);
        this.doc.setFontSize(fontSize);
        this.doc.setFont(undefined, bold ? 'bold' : 'normal');
        
        const splitText = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
        this.doc.text(splitText, this.margin, this.currentY);
        
        this.currentY += (splitText.length * 5) + 5;
    }

    private addStatBox(title: string, value: string | number, color: keyof typeof this.colors = 'secondary') {
        this.checkPageBreak(40);
        
        const boxWidth = (this.pageWidth - 3 * this.margin) / 2;
        const boxHeight = 30;
        
        // Box background
        this.doc.setFillColor(...this.colors[color]);
        this.doc.rect(this.margin, this.currentY, boxWidth, boxHeight, 'F');
        
        // Title
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(title, this.margin + 5, this.currentY + 12);
        
        // Value
        this.doc.setFontSize(18);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(String(value), this.margin + 5, this.currentY + 25);
        
        return boxWidth + this.margin;
    }

    private addTable(headers: string[], rows: any[][]) {
        this.checkPageBreak(50);
        
        const startY = this.currentY;
        const colWidth = (this.pageWidth - 2 * this.margin) / headers.length;
        const rowHeight = 12;
        
        // Header
        this.doc.setFillColor(...this.colors.primary);
        this.doc.rect(this.margin, startY, this.pageWidth - 2 * this.margin, rowHeight, 'F');
        
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'bold');
        
        headers.forEach((header, i) => {
            this.doc.text(header, this.margin + (i * colWidth) + 2, startY + 8);
        });
        
        // Rows
        this.doc.setTextColor(...this.colors.dark);
        this.doc.setFont(undefined, 'normal');
        
        rows.forEach((row, rowIndex) => {
            const y = startY + (rowIndex + 1) * rowHeight;
            
            if (rowIndex % 2 === 1) {
                this.doc.setFillColor(...this.colors.light);
                this.doc.rect(this.margin, y, this.pageWidth - 2 * this.margin, rowHeight, 'F');
            }
            
            row.forEach((cell, cellIndex) => {
                this.doc.text(String(cell), this.margin + (cellIndex * colWidth) + 2, y + 8);
            });
        });
        
        this.currentY = startY + (rows.length + 1) * rowHeight + 10;
    }

    private checkPageBreak(requiredHeight: number) {
        if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
            this.doc.addPage();
            this.currentY = this.margin;
        }
    }

    private addFooter() {
        this.doc.setFontSize(8);
        this.doc.setTextColor(128, 128, 128);
        this.doc.text(
            `Generated on ${new Date().toLocaleDateString()} | Mavericks Coding Platform`,
            this.pageWidth / 2,
            this.pageHeight - 10,
            { align: 'center' }
        );
    }

    public generateUserReport(user: UserProfile): void {
        // Header
        this.addHeader(
            `${user.name} - Profile Report`,
            `Comprehensive analysis and statistics`
        );

        // Basic Info Section
        this.addSection('👤 Basic Information');
        this.addText(`📧 Email: ${user.email}`, 11, true);
        this.addText(`🎯 Current Role: ${user.currentRole || 'Not specified'}`);
        this.addText(`✨ Dream Role: ${user.dreamRole || 'Not specified'}`);
        this.addText(`📍 Location: ${user.location || 'Not specified'}`);
        this.addText(`💼 LinkedIn: ${user.linkedinUrl || 'Not provided'}`);
        this.addText(`🐙 GitHub: ${user.githubUsername || 'Not provided'}`);

        // Statistics Section
        this.addSection('📊 Key Statistics');
        
        // Use stat boxes for key metrics - Row 1
        this.addStatBox('Problems Solved', user.questionsSolved || 0, 'success');
        // Second box on the same row - calculate X position manually
        const boxWidth = (this.pageWidth - 3 * this.margin) / 2;
        const secondBoxX = this.margin + boxWidth + this.margin;
        const currentYBackup = this.currentY;
        this.currentY -= 30; // Move back up to align with first box
        this.doc.setFillColor(...this.colors.secondary);
        this.doc.rect(secondBoxX, this.currentY, boxWidth, 30, 'F');
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.text('Assessment Score', secondBoxX + 5, this.currentY + 12);
        this.doc.setFontSize(18);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(`${user.assessmentScore}%`, secondBoxX + 5, this.currentY + 25);
        this.currentY = currentYBackup;
        
        this.currentY += 15;
        
        // Row 2
        this.addStatBox('XP Points', user.xp || 0, 'warning');
        // Second box on the same row
        const currentYBackup2 = this.currentY;
        this.currentY -= 30;
        this.doc.setFillColor(...this.colors.primary);
        this.doc.rect(secondBoxX, this.currentY, boxWidth, 30, 'F');
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(10);
        this.doc.text('Level', secondBoxX + 5, this.currentY + 12);
        this.doc.setFontSize(18);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(String(user.level || 1), secondBoxX + 5, this.currentY + 25);
        this.currentY = currentYBackup2;

        this.currentY += 15;

        // Skills Section
        if (user.skills && user.skills.length > 0) {
            this.addSection('🛠️ Skills & Expertise');
            
            const skillHeaders = ['Skill Name', 'Proficiency Level'];
            const skillRows = user.skills.map(skill => [skill.name, skill.level]);
            
            this.addTable(skillHeaders, skillRows);
        }

        // Learning Progress Section
        if (user.learningPaths && user.learningPaths.length > 0) {
            this.addSection('📚 Learning Paths Progress');
            
            user.learningPaths.forEach(path => {
                this.addText(`📖 ${path.title}`, 12, true);
                this.addText(`Summary: ${path.summary}`);
                
                const completed = path.modules.filter(m => m.completed).length;
                const total = path.modules.length;
                const progress = Math.round((completed / total) * 100);
                
                this.addText(`Progress: ${completed}/${total} modules (${progress}%)`);
                this.currentY += 5;
            });
        }

        // Activity Analysis
        if (user.activity && user.activity.length > 0) {
            this.addSection('📈 Recent Activity Analysis');
            
            const recentActivity = user.activity.slice(0, 10);
            const headers = ['Date', 'Activity Type', 'Language', 'Score'];
            const rows = recentActivity.map(act => [
                new Date(act.date).toLocaleDateString(),
                act.type,
                act.language,
                act.score !== undefined ? `${act.score}%` : 'N/A'
            ]);
            
            this.addTable(headers, rows);
            
            // Activity summary
            const languages = user.activity.map(a => a.language);
            const uniqueLanguages = [...new Set(languages)];
            const avgScore = user.activity.reduce((sum, a) => sum + (a.score || 0), 0) / user.activity.length;
            
            this.addText(`🔥 Most Active Languages: ${uniqueLanguages.slice(0, 3).join(', ')}`, 11, true);
            this.addText(`📊 Average Performance Score: ${Math.round(avgScore)}%`, 11, true);
        }

        // Recommendations Section
        this.addSection('💡 Recommendations');
        this.addText('Based on your profile analysis:', 11, true);
        
        if (user.assessmentScore < 70) {
            this.addText('• Focus on fundamental concepts to improve assessment scores');
        } else if (user.assessmentScore >= 90) {
            this.addText('• Excellent performance! Consider mentoring others or taking on leadership roles');
        } else {
            this.addText('• Good progress! Continue practicing to reach expert level');
        }
        
        if (user.questionsSolved < 50) {
            this.addText('• Increase daily coding practice to solve more problems');
        }
        
        if (!user.dreamRole || user.dreamRole === user.currentRole) {
            this.addText('• Consider exploring new career paths and setting specific goals');
        }

        this.addFooter();

        // Save the document
        this.doc.save(`${user.name.replace(/\s+/g, '_')}_Enhanced_Report.pdf`);
    }

    public generateAdminReport(data: any): void {
        // Header
        this.addHeader(
            'Mavericks Platform Analytics',
            'Comprehensive platform performance report'
        );

        // Overview Section
        this.addSection('🌟 Platform Overview');
        
        let xOffset = this.margin;
        xOffset = this.addStatBox('Total Users', data.totalUsers, 'primary');
        this.addStatBox('Active Users', data.activeUsers, 'success');
        
        this.currentY += 45;
        xOffset = this.margin;
        xOffset = this.addStatBox('Inactive Users', data.inactiveUsers, 'warning');
        this.addStatBox('Site Health', data.siteHealth, 'secondary');

        this.currentY += 20;

        // Top Performers
        if (data.topUsersByXp && data.topUsersByXp.length > 0) {
            this.addSection('🏆 Top Performers');
            
            const headers = ['Rank', 'Name', 'XP Points', 'Level'];
            const rows = data.topUsersByXp.map((user: any, index: number) => [
                index + 1,
                user.name,
                user.xp || 0,
                user.level || 1
            ]);
            
            this.addTable(headers, rows);
        }

        // Community Contributors
        if (data.topContributors && data.topContributors.length > 0) {
            this.addSection('🤝 Top Community Contributors');
            
            const headers = ['Rank', 'Name', 'Posts', 'Score'];
            const rows = data.topContributors.map((c: any, index: number) => [
                index + 1,
                c.name,
                c.posts,
                c.score
            ]);
            
            this.addTable(headers, rows);
        }

        this.addFooter();

        // Save the document
        this.doc.save(`Mavericks_Enhanced_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    }
}

// Export convenience functions
export const generateEnhancedUserReport = (user: UserProfile) => {
    const generator = new EnhancedReportGenerator();
    generator.generateUserReport(user);
};

export const generateEnhancedAdminReport = (data: any) => {
    const generator = new EnhancedReportGenerator();
    generator.generateAdminReport(data);
};
