const fs = require('fs');

// 1. AddDesignationModal
let file = 'src/components/AddDesignationModal.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
`                      </button>
                  </div>
          )}

                  {/* Shared validation / server message */}`,
`                      </button>
                    </div>
                  </div>
          )}

                  {/* Shared validation / server message */}`
);
content = content.replace(
`                        ? "bg-white/20 text-slate-900 dark:text-white"
                        : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"
                          ? "bg-white/20 text-slate-900 dark:text-white"
                          : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"`,
`                        ? "bg-white/20 text-slate-900 dark:text-white"
                        : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"`
);
fs.writeFileSync(file, content);

// 2. AddDepartmentModal
file = 'src/components/AddDepartmentModal.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
`                      </button>
                  </div>
          )}

                  {/* Shared validation / server message */}`,
`                      </button>
                    </div>
                  </div>
          )}

                  {/* Shared validation / server message */}`
);
content = content.replace(
`                        ? "bg-white/20 text-slate-900 dark:text-white"
                        : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"
                          ? "bg-white/20 text-slate-900 dark:text-white"
                          : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"`,
`                        ? "bg-white/20 text-slate-900 dark:text-white"
                        : "bg-[#132b49] text-slate-500 dark:text-[#9eb0cc]"`
);
fs.writeFileSync(file, content);

// 3. EditFacultyCanvas
file = 'src/pages/Dashboards/AdminDashboard/Faculty-Management/EditFacultyCanvas.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
`      </div>
    </section>`,
`      </div>
      </div>
    </section>`
);
fs.writeFileSync(file, content);

// 4. AddFacultyForm
file = 'src/pages/Dashboards/AdminDashboard/Faculty-Management/AddFacultyForm.jsx';
content = fs.readFileSync(file, 'utf8');
content = content.replace(
`              )}
          </div>
        </>
      )}`,
`              )}
            </div>
          </div>
        </>
      )}`
);
content = content.replace(
`                        ? "bg-slate-100 dark:bg-[#132b49] text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"
                        ? "bg-slate-100 dark:bg-[#132b49] text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"`,
`                        ? "bg-slate-100 dark:bg-[#132b49] text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"`
);
content = content.replace(
`                        ? "bg-slate-100 dark:bg-[#132b49] text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"`,
`                        ? "bg-slate-100 dark:bg-[#132b49] text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-[#cad7eb] hover:bg-gray-100 dark:bg-[#102640] hover:text-slate-900 dark:text-white"`
);
fs.writeFileSync(file, content);

console.log('Fixed syntax errors');
