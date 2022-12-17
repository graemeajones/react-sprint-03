import { useState } from 'react';
import API from '../../api/API.js';
import Panel from '../../UI/Panel.js';
import ObjectTable from '../../UI/ObjectTable.js';
import { ActionTray, ActionModify, ActionDelete } from '../../UI/Actions.js';
import ToolTipDecorator from '../../UI/ToolTipDecorator.js';
import ModuleForm from '../../entities/modules/ModuleForm.js';


export default function ModulePanels({ modules, reloadModules }) {

  // Initialisation ------------------------------
  const putModulesEndpoint = '/modules';
  const deleteModulesEndpoint = '/modules';

  // State ---------------------------------------
  const [showFormId, setShowFormId] = useState(0);

  // Context -------------------------------------
  // Methods -------------------------------------
  const toggleModify = (id) => setShowFormId(showFormId === id ? 0 : id);
  const handleCancel = () => setShowFormId(0);
  const handleSubmit = async (module) => {
    const response = await API.put(`${putModulesEndpoint}/${module.ModuleID}`, module);
    if (response.isSuccess) {
      setShowFormId(0);
      reloadModules();
    }
  }
  const handleDelete = async (id) => { 
    const response = await API.delete(`${deleteModulesEndpoint}/${id}`);
    response.isSuccess && reloadModules();
  }

  // View ----------------------------------------
  const displayableAttributes = [
    { key: 'ModuleLevel', label: 'Module level' },
    { key: 'ModuleYearName', label: 'Year taken' },
    { key: 'ModuleLeaderName', label: 'Module leader' }
  ];

  return (
    <Panel.Container>
      {
        modules.map((module) =>
          <Panel
            key={module.ModuleID}
            title={`${module.ModuleCode} ${module.ModuleName}`}
            level={3}
          >
            <Panel.Static level={4}>
              <ObjectTable object={module} attributes={displayableAttributes} />
            </Panel.Static>

            <ActionTray>
              <ToolTipDecorator message="Modify this module">
                <ActionModify showText onClick={() => toggleModify(module.ModuleID)} buttonText="Modify module"/>
              </ToolTipDecorator>
              <ToolTipDecorator message="Delete this module">
                <ActionDelete showText onClick={() => handleDelete(module.ModuleID)} buttonText="Delete module"/>
              </ToolTipDecorator>
            </ActionTray>

            {
              (showFormId === module.ModuleID ) &&
                <ModuleForm initialModule={module} onCancel={handleCancel} onSubmit={handleSubmit} />
            }

          </Panel>
        )
      }
    </Panel.Container>
  );
}